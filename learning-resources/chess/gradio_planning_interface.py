"""Gradio Planning Interface with Blaxel and Modal Labs GPU Support"""

import gradio as gr
import asyncio
import json
import os
from datetime import datetime
from typing import Dict, Any, Tuple, List
from dotenv import load_dotenv

from gpu_providers import FallbackManager
from gpu_providers.base_provider import ProviderStatus

# Load environment variables
load_dotenv()


class PlanningInterface:
    """Main planning interface using Gradio"""

    def __init__(self):
        self.fallback_manager = FallbackManager()
        self.execution_history = []
        self.is_initialized = False

    async def initialize(self):
        """Initialize the GPU providers"""
        if not self.is_initialized:
            await self.fallback_manager.initialize()
            self.is_initialized = True

    def create_interface(self) -> gr.Blocks:
        """Create the Gradio interface"""

        with gr.Blocks(title="GPU Planning Interface - Blaxel & Modal Labs") as demo:
            gr.Markdown("""
            # 🚀 GPU Planning Interface
            ## Powered by Blaxel & Modal Labs

            This interface provides GPU-accelerated planning with automatic fallback between providers.
            """)

            with gr.Tab("Planning"):
                with gr.Row():
                    with gr.Column(scale=2):
                        planning_input = gr.Textbox(
                            label="Planning Input",
                            placeholder="Describe what you want to plan...",
                            lines=5
                        )

                        with gr.Row():
                            task_type = gr.Dropdown(
                                choices=["planning", "inference", "analysis", "custom"],
                                value="planning",
                                label="Task Type"
                            )
                            priority = gr.Dropdown(
                                choices=["low", "normal", "high"],
                                value="normal",
                                label="Priority"
                            )

                        with gr.Row():
                            submit_btn = gr.Button("Execute Plan", variant="primary")
                            clear_btn = gr.Button("Clear")

                    with gr.Column(scale=1):
                        gr.Markdown("### Provider Status")
                        status_display = gr.JSON(label="Current Status")
                        refresh_status_btn = gr.Button("Refresh Status")

                with gr.Row():
                    output_display = gr.Textbox(
                        label="Execution Result",
                        lines=10,
                        interactive=False
                    )

                with gr.Row():
                    execution_time_display = gr.Textbox(
                        label="Execution Time",
                        interactive=False
                    )
                    provider_used_display = gr.Textbox(
                        label="Provider Used",
                        interactive=False
                    )

            with gr.Tab("History"):
                history_display = gr.JSON(label="Execution History")
                refresh_history_btn = gr.Button("Refresh History")

            with gr.Tab("Advanced"):
                gr.Markdown("### Advanced Configuration")

                with gr.Row():
                    fallback_order_input = gr.Textbox(
                        label="Fallback Order (comma-separated)",
                        value=os.getenv('GPU_FALLBACK_ORDER', 'modal,blaxel'),
                        placeholder="modal,blaxel"
                    )
                    update_fallback_btn = gr.Button("Update Fallback Order")

                with gr.Row():
                    retry_attempts_input = gr.Number(
                        label="Retry Attempts",
                        value=int(os.getenv('FALLBACK_RETRY_ATTEMPTS', '3')),
                        precision=0
                    )

                test_providers_btn = gr.Button("Test All Providers")
                test_output = gr.Textbox(label="Test Results", lines=8, interactive=False)

            with gr.Tab("About"):
                gr.Markdown("""
                ## About This Interface

                This planning interface integrates:

                ### GPU Providers
                - **Modal Labs**: Serverless GPU compute platform
                - **Blaxel**: High-performance GPU API service

                ### Features
                - ✨ Automatic provider fallback
                - 🔄 Retry logic with configurable attempts
                - 📊 Real-time provider status monitoring
                - 📝 Execution history tracking
                - ⚙️ Configurable provider preferences

                ### Configuration
                Set up your `.env` file with:
                ```
                MODAL_TOKEN_ID=your_modal_token_id
                MODAL_TOKEN_SECRET=your_modal_token_secret
                BLAXEL_API_KEY=your_blaxel_api_key
                GPU_FALLBACK_ORDER=modal,blaxel
                ```

                ### Usage
                1. Enter your planning input
                2. Select task type and priority
                3. Click "Execute Plan"
                4. The system will automatically try providers in order until successful
                """)

            # Event handlers
            submit_btn.click(
                fn=self.execute_planning_task,
                inputs=[planning_input, task_type, priority],
                outputs=[output_display, execution_time_display, provider_used_display]
            )

            clear_btn.click(
                fn=lambda: ("", "", ""),
                outputs=[planning_input, output_display, execution_time_display]
            )

            refresh_status_btn.click(
                fn=self.get_provider_status,
                outputs=[status_display]
            )

            refresh_history_btn.click(
                fn=self.get_execution_history,
                outputs=[history_display]
            )

            test_providers_btn.click(
                fn=self.test_all_providers,
                outputs=[test_output]
            )

            update_fallback_btn.click(
                fn=self.update_fallback_order,
                inputs=[fallback_order_input],
                outputs=[status_display]
            )

            # Auto-refresh status on load
            demo.load(
                fn=self.get_provider_status,
                outputs=[status_display]
            )

        return demo

    def execute_planning_task(
        self,
        planning_input: str,
        task_type: str,
        priority: str
    ) -> Tuple[str, str, str]:
        """Execute a planning task with GPU acceleration"""

        # Run async initialization and execution
        result = asyncio.run(self._execute_task_async(planning_input, task_type, priority))
        return result

    async def _execute_task_async(
        self,
        planning_input: str,
        task_type: str,
        priority: str
    ) -> Tuple[str, str, str]:
        """Async execution of planning task"""

        await self.initialize()

        if not planning_input.strip():
            return "Error: Please provide planning input", "", ""

        # Prepare task
        task = {
            'type': task_type,
            'input': planning_input,
            'prompt': planning_input,
            'priority': priority,
            'timestamp': datetime.now().isoformat()
        }

        # Execute with fallback
        response = await self.fallback_manager.execute_with_fallback(task)

        # Format output
        if response.success:
            output = json.dumps(response.data, indent=2)
            exec_time = f"{response.execution_time:.2f}s" if response.execution_time else "N/A"
            provider = response.provider or "Unknown"

            # Add to history
            self.execution_history.append({
                'timestamp': task['timestamp'],
                'task_type': task_type,
                'provider': provider,
                'success': True,
                'execution_time': exec_time
            })

            return output, exec_time, provider
        else:
            error_msg = f"Error: {response.error}"

            # Add to history
            self.execution_history.append({
                'timestamp': task['timestamp'],
                'task_type': task_type,
                'provider': response.provider or "None",
                'success': False,
                'error': response.error
            })

            return error_msg, "", response.provider or "Failed"

    def get_provider_status(self) -> Dict[str, Any]:
        """Get current provider status"""
        if not self.is_initialized:
            asyncio.run(self.initialize())

        return self.fallback_manager.get_provider_info()

    def get_execution_history(self) -> List[Dict[str, Any]]:
        """Get execution history"""
        return self.execution_history[-20:]  # Last 20 executions

    def test_all_providers(self) -> str:
        """Test all providers with a simple task"""
        result = asyncio.run(self._test_providers_async())
        return result

    async def _test_providers_async(self) -> str:
        """Async test of all providers"""
        await self.initialize()

        test_task = {
            'type': 'planning',
            'input': 'Test task for provider validation',
            'priority': 'low'
        }

        results = []
        results.append("=== Testing All Providers ===\n")

        for provider_name, provider in self.fallback_manager.providers.items():
            results.append(f"\nTesting {provider_name}...")
            status = await provider.check_availability()
            results.append(f"  Status: {status.value}")

            if status == ProviderStatus.AVAILABLE:
                try:
                    response = await provider.execute(test_task)
                    if response.success:
                        results.append(f"  ✓ Test passed ({response.execution_time:.2f}s)")
                    else:
                        results.append(f"  ✗ Test failed: {response.error}")
                except Exception as e:
                    results.append(f"  ✗ Error: {str(e)}")

        results.append("\n=== Test Complete ===")
        return "\n".join(results)

    def update_fallback_order(self, fallback_order: str) -> Dict[str, Any]:
        """Update the fallback order"""
        new_order = [p.strip() for p in fallback_order.split(',')]
        self.fallback_manager.fallback_order = new_order
        os.environ['GPU_FALLBACK_ORDER'] = fallback_order

        return {
            'message': 'Fallback order updated',
            'new_order': new_order,
            'info': self.fallback_manager.get_provider_info()
        }


def main():
    """Main entry point"""
    interface = PlanningInterface()
    demo = interface.create_interface()

    # Launch the interface
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_error=True
    )


if __name__ == "__main__":
    main()
