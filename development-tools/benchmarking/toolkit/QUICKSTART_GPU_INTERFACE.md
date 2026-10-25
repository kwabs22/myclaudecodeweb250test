# Quick Start: GPU Planning Interface

Get up and running with the GPU Planning Interface in 5 minutes!

## 🚀 Quick Setup

### 1. Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install all dependencies
- Create `.env` file from template
- Verify installation

### 2. Configure API Keys

Edit `.env` file:

```bash
nano .env  # or use your preferred editor
```

Add your credentials:
```env
MODAL_TOKEN_ID=your_actual_token_id
MODAL_TOKEN_SECRET=your_actual_token_secret
BLAXEL_API_KEY=your_actual_api_key
```

### 3. Test the Setup

Run the demo to verify everything works:

```bash
python demo_gpu_providers.py 1
```

Expected output:
```
DEMO 1: Basic Task Execution
=== Initializing GPU Providers ===
...
✓ Execution successful!
```

### 4. Start the Interface

```bash
python gradio_planning_interface.py
```

Open your browser to: `http://localhost:7860`

## 🎯 First Task

1. In the Planning tab, enter:
   ```
   Create a step-by-step plan for building a simple web app
   ```

2. Select task type: `planning`

3. Click **Execute Plan**

4. Watch as the system:
   - Tries Modal Labs first
   - Falls back to Blaxel if needed
   - Returns your result

## 📊 What You Can Do

### Planning Tasks
```
Plan a marketing campaign for a new product launch
```

### Analysis Tasks
```
Analyze the pros and cons of using microservices architecture
```

### Inference Tasks
```
Generate Python code for a REST API endpoint
```

## 🔍 Explore Features

### Check Provider Status
Click **"Refresh Status"** to see which providers are active

### View History
Go to the **History** tab to see all past executions

### Advanced Settings
In the **Advanced** tab:
- Change provider priority order
- Adjust retry attempts
- Test individual providers

## 🛠️ Troubleshooting

### "Provider not available"
- Check your API keys in `.env`
- Verify internet connection
- Check provider status dashboards

### "All providers failed"
- Ensure at least one provider has valid credentials
- Check the error messages in console
- Try running demo script for detailed output

### Import errors
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

## 📚 Next Steps

1. **Read full documentation**: `GPU_PLANNING_INTERFACE.md`
2. **Try all demos**: `python demo_gpu_providers.py all`
3. **Customize providers**: Edit `gpu_providers/` modules
4. **Add new providers**: Follow the development guide

## 💡 Tips

- **Modal Labs**: Best for complex ML tasks, serverless GPU compute
- **Blaxel**: Great for API-based GPU access, consistent performance
- **Fallback Order**: Put your preferred provider first for speed
- **Retry Attempts**: Higher = more resilient, but slower on failures

## 🎓 Examples

### Change Fallback Order
In Advanced tab:
```
blaxel,modal  # Try Blaxel first, then Modal
```

### High Priority Task
```
Task Type: planning
Priority: high
Input: Urgent - analyze security vulnerabilities
```

### Custom Task
```
Task Type: custom
Input: Process large dataset with GPU acceleration
```

## ✅ Checklist

- [ ] Ran `setup.sh`
- [ ] Configured `.env` with API keys
- [ ] Tested with `demo_gpu_providers.py`
- [ ] Started Gradio interface
- [ ] Executed first planning task
- [ ] Checked provider status
- [ ] Viewed execution history

## 🆘 Get Help

- Check troubleshooting section above
- Review error messages in terminal
- Verify API credentials are correct
- Test providers individually in Advanced tab
- Run demo scripts for detailed debugging

---

**Ready to plan with GPU power!** 🚀
