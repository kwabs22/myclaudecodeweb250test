# AI Engineer Roadmap: GitHub Repository Guide 2024-2025

A comprehensive collection of GitHub repositories mapped to the "God Tier" AI Engineer Roadmap. This guide provides curated resources for each phase of your journey from fundamentals to production-ready AI systems.

**Based on**: ["God Tier" AI Engineer Roadmap](https://www.youtube.com/watch?v=ewLJUvQbOu4)
**Last Updated**: 2025-11-18
**Total Repositories**: 60+ curated projects

---

## 📋 Table of Contents

1. [Phase 1: Mastering the Fundamentals](#phase-1-mastering-the-fundamentals)
2. [Phase 2: The Data Wizard (Machine Learning)](#phase-2-the-data-wizard-machine-learning)
3. [Phase 3: Generative AI (Structured Path)](#phase-3-generative-ai-structured-path)
4. [Phase 4: Engineering in Production (MLOps)](#phase-4-engineering-in-production-mlops)
5. [Phase 5: State of the Art (Advanced)](#phase-5-state-of-the-art-advanced)
6. [Phase 6: Project Building](#phase-6-project-building)
7. [Learning Paths](#learning-paths)
8. [Additional Resources](#additional-resources)

---

## Phase 1: Mastering the Fundamentals

**Timeline**: 3-6 months
**Focus**: Mathematics, Python, SQL, Data Structures & Algorithms

### 1.1 Linear Algebra

**Video Recommendation**: 3Blue1Brown's "Essence of Linear Algebra" playlist

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [fastai/numerical-linear-algebra](https://github.com/fastai/numerical-linear-algebra) | 10k+ | Free online textbook of Jupyter notebooks for fast.ai Computational Linear Algebra course | Practical ML applications |
| [weijie-chen/Linear-Algebra-With-Python](https://github.com/weijie-chen/Linear-Algebra-With-Python) | 1k+ | Lecture notes for Linear Algebra with Python computation and visualization | Data scientists, quants |
| [akhilvasvani/Linear-Algebra-Basics](https://github.com/akhilvasvani/Linear-Algebra-Basics) | 500+ | Linear Algebra fundamentals for Machine Learning, follows Deep Learning Book | ML beginners |
| [cszach/awesome-linear-algebra](https://github.com/cszach/awesome-linear-algebra) | 300+ | Curated list of linear algebra resources | Comprehensive reference |

**Learning Path**:
1. Start with 3Blue1Brown videos for intuition
2. Work through fastai/numerical-linear-algebra notebooks
3. Practice with akhilvasvani's fundamentals repo
4. Apply concepts using NumPy

---

### 1.2 Calculus

**Video Recommendation**: GeeksForGeeks tutorial series

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [MonitSharma/Numerical-Linear-Algebra](https://github.com/MonitSharma/Numerical-Linear-Algebra) | 200+ | Covers calculus topics for ML including derivatives, gradients | Understanding optimization |

**Key Topics**:
- Derivatives and gradients (for backpropagation)
- Partial derivatives (for multi-variable optimization)
- Chain rule (essential for neural networks)
- Gradient descent fundamentals

**Supplementary Resources**:
- [3Blue1Brown's Essence of Calculus](https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr)
- GeeksForGeeks Calculus tutorials

---

### 1.3 Probability & Statistics

**Video Recommendation**: Carnegie Mellon's open Probability and Statistics course

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [fastai/numerical-linear-algebra](https://github.com/fastai/numerical-linear-algebra) | 10k+ | Includes statistical concepts for ML | Practical applications |

**Key Topics to Master**:
- Probability distributions
- Bayesian statistics
- Statistical inference
- Hypothesis testing
- Data preprocessing and normalization

**Note**: Check "10 GitHub Repositories to Master Math" article on KDnuggets for comprehensive math resources.

---

### 1.4 Python Programming

**Video Recommendation**: "Automate the Boring Stuff with Python" or DataCamp

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [numpy-pandas tutorials](https://github.com/topics/numpy-pandas) | Various | Collections of NumPy and Pandas tutorials | Data manipulation |
| [prabhupant/python-ds](https://github.com/prabhupant/python-ds) | 7k+ | No-nonsense Data Structures solutions in Python | Interview prep |

**Essential Libraries**:
- **NumPy**: Array operations, linear algebra
- **Pandas**: Data manipulation, analysis
- **Matplotlib/Seaborn**: Data visualization
- **Jupyter**: Interactive development

**Learning Projects**:
1. Data cleaning and preprocessing scripts
2. Statistical analysis notebooks
3. Visualization dashboards
4. Automation scripts for data pipelines

---

### 1.5 SQL

**Video Recommendation**: SQLBolt (interactive challenges) or DataCamp

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [chinomsokoye/sqlbolt](https://github.com/chinomsokoye/sqlbolt) | 100+ | Solutions to SQLBolt interactive exercises | Hands-on practice |
| [mouni2619/SQL_BOLT](https://github.com/mouni2619/SQL_BOLT) | 50+ | Complete SQLBolt tutorial with query results | Query, filter, join |

**Key Topics**:
- SELECT, WHERE, JOIN operations
- Aggregation (GROUP BY, HAVING)
- Subqueries and CTEs
- Window functions
- Database design basics

**Practice Platform**: [SQLBolt.com](https://sqlbolt.com/) - Free interactive SQL tutorial

---

### 1.6 Data Structures & Algorithms

**Video Recommendation**: Interactive roadmap (skip language-specifics)

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [prabhupant/python-ds](https://github.com/prabhupant/python-ds) | 7k+ | Clean, elegant data structure implementations | Code quality |
| [thepranaygupta/Data-Structures-and-Algorithms](https://github.com/thepranaygupta/Data-Structures-and-Algorithms) | 2k+ | Complete DSA concepts with interview questions | Interview prep |
| [OmkarPathak/Data-Structures-using-Python](https://github.com/OmkarPathak/Data-Structures-using-Python) | 1k+ | Comprehensive Python data structures | Learning |

**Focus Areas for AI Engineers**:
- Arrays and Matrices (tensor operations)
- Trees and Graphs (neural network structures)
- Hash Tables (lookup optimization)
- Dynamic Programming (sequence modeling)
- Time/Space Complexity (model efficiency)

---

## Phase 2: The Data Wizard (Machine Learning)

**Timeline**: 4-6 months
**Focus**: Classical ML, Deep Learning, Neural Networks

### 2.1 Classical Machine Learning with Scikit-learn

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [microsoft/ML-For-Beginners](https://github.com/microsoft/ML-For-Beginners) | 69k+ | 12-week curriculum, 26 lessons, 52 quizzes, Scikit-learn focus | Structured learning |
| [ageron/handson-ml3](https://github.com/ageron/handson-ml3) | 26k+ | Hands-on Machine Learning with Scikit-Learn, Keras, TensorFlow 2 | O'Reilly book companion |

**Key Algorithms to Master**:

**Supervised Learning**:
- Linear Regression (house prices, predictions)
- Logistic Regression (binary classification)
- Decision Trees and Random Forests
- Support Vector Machines (SVM)
- Gradient Boosting (XGBoost, LightGBM)

**Unsupervised Learning**:
- K-Means Clustering
- Principal Component Analysis (PCA)
- Anomaly Detection

**Learning Path**:
1. **Week 1-4**: Microsoft's ML-For-Beginners (Lessons 1-13)
2. **Week 5-8**: ageron's Hands-on ML (Chapters 1-9)
3. **Week 9-12**: Build 3 classification projects
4. **Week 13-16**: Build 3 regression projects

**Project Ideas**:
- Customer churn prediction
- House price prediction
- Credit card fraud detection
- Customer segmentation

---

### 2.2 Deep Learning with PyTorch or TensorFlow

**Framework Choice**: Pick **ONE** - PyTorch recommended for flexibility and research

**PyTorch Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [mrdbourke/pytorch-deep-learning](https://github.com/mrdbourke/pytorch-deep-learning) | 10k+ | Zero to Mastery course, beginner-friendly, includes videos | Complete beginners |
| [yunjey/pytorch-tutorial](https://github.com/yunjey/pytorch-tutorial) | 30k+ | PyTorch tutorial for deep learning researchers, <30 lines per model | Quick reference |
| [LukeDitria/pytorch_tutorials](https://github.com/LukeDitria/pytorch_tutorials) | 3k+ | Beginner to advanced with YouTube videos, includes deployment | Comprehensive |
| [dvgodoy/PyTorchStepByStep](https://github.com/dvgodoy/PyTorchStepByStep) | 4k+ | Official book repository, reproducible Jupyter notebooks | Book learners |
| [udacity/deep-learning-v2-pytorch](https://github.com/udacity/deep-learning-v2-pytorch) | 5k+ | Udacity Deep Learning Nanodegree projects | Structured course |
| [ritchieng/the-incredible-pytorch](https://github.com/ritchieng/the-incredible-pytorch) | 10k+ | Curated list of tutorials, papers, projects | Resource hub |

**TensorFlow Alternative**:
- [TensorFlow Official Tutorials](https://github.com/tensorflow/tensorflow)
- [Deep Learning with TensorFlow 2](https://github.com/ageron/handson-ml3)

**Key Concepts**:
- Neural Networks (weights, biases, neurons)
- Activation functions (ReLU, Sigmoid, Tanh)
- Loss functions and optimizers
- Backpropagation and gradient descent
- Regularization (Dropout, Batch Normalization)
- Convolutional Neural Networks (CNNs)
- Recurrent Neural Networks (RNNs, LSTMs)

**Learning Path**:
1. **Week 1-2**: Neural network fundamentals (mrdbourke repo)
2. **Week 3-4**: Computer vision with CNNs
3. **Week 5-6**: Sequence modeling with RNNs
4. **Week 7-8**: Transfer learning and fine-tuning
5. **Week 9-12**: Build 3 deep learning projects

**Project Ideas**:
- Image classification (CIFAR-10, ImageNet)
- Object detection
- Sentiment analysis
- Time series prediction

---

### 2.3 Prompt Engineering

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | 49k+ | Comprehensive guide, 3M+ learners, web version available | Complete reference |
| [microsoft/promptbase](https://github.com/microsoft/promptbase) | 5k+ | Microsoft's Medprompt methodology, specialist-level performance | Advanced techniques |
| [duriri/prompt-engineering](https://github.com/duriri/prompt-engineering) | 1k+ | Curated patterns: CoT, Few-Shot, Zero-Shot, Role Prompting | Practical examples |

**Key Techniques**:
- **Zero-shot**: Direct task instruction without examples
- **Few-shot**: Providing 2-5 examples for context
- **Chain-of-Thought (CoT)**: Step-by-step reasoning
- **Self-Consistency**: Multiple reasoning paths
- **Role Prompting**: Assigning expert personas

**Learning Path**:
1. Study dair-ai comprehensive guide
2. Practice with OpenAI Playground
3. Implement Microsoft's Medprompt patterns
4. Build prompt template library

---

## Phase 3: Generative AI (Structured Path)

**Timeline**: 3-4 months
**Focus**: LLMs, RAG, Vector Databases, Agentic Frameworks

### 3.1 OpenAI API

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [openai/openai-python](https://github.com/openai/openai-python) | 22k+ | Official Python library for OpenAI API | Official reference |
| [solygambas/python-openai-projects](https://github.com/solygambas/python-openai-projects) | 1k+ | 13 projects: ChatGPT API, Whisper, Embeddings, DALL-E | Practical projects |
| [OpenAI Cookbook](https://cookbook.openai.com/) | Official | Official guides and examples | Best practices |

**Key Projects from solygambas repo**:
1. Simple command-line chatbot with GPT-4
2. Playlist generator for Spotify with GPT-4
3. Dynamic Q&A Bot using GPT-4
4. Image generation with DALL-E
5. Speech-to-text with Whisper

**Learning Path**:
1. Set up OpenAI API and authentication
2. Build simple chatbot with system/user messages
3. Implement function calling
4. Work with embeddings
5. Build multi-modal applications

---

### 3.2 Hugging Face Ecosystem

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [huggingface/transformers](https://github.com/huggingface/transformers) | 133k+ | State-of-the-art ML for PyTorch, TensorFlow, JAX | Model library |
| [huggingface/peft](https://github.com/huggingface/peft) | 16k+ | Parameter-Efficient Fine-Tuning (LoRA, QLoRA) | Efficient fine-tuning |
| [huggingface/datasets](https://github.com/huggingface/datasets) | 19k+ | Access 100k+ datasets | Data access |

**Key Concepts**:
- Model Hub: 400k+ pre-trained models
- Pipelines: High-level API for inference
- Tokenizers: Fast text preprocessing
- Datasets: Easy data loading
- Spaces: Host ML demos

**Learning Path**:
1. Explore Hugging Face Model Hub
2. Use pipelines for inference
3. Load and preprocess datasets
4. Fine-tune models on custom data
5. Deploy models to Spaces

---

### 3.3 Vector Databases & Embeddings

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [chroma-core/chroma](https://github.com/chroma-core/chroma) | 14k+ | Open-source embedding database | Rapid prototyping |
| [qdrant/qdrant](https://github.com/qdrant/qdrant) | 20k+ | Vector similarity search engine | Production scale |
| [milvus-io/milvus](https://github.com/milvus-io/milvus) | 29k+ | Cloud-native vector database | Enterprise |

**Key Concepts**:
- Embeddings: Dense vector representations of text
- Semantic search: Find similar content
- Vector indexing: Efficient similarity search
- Hybrid search: Combine keyword + semantic

**Popular Options**:
- **Chroma**: Simple, developer-friendly, great for prototyping
- **Pinecone**: Managed service, easy deployment
- **Qdrant**: High performance, Rust-based
- **Milvus**: Enterprise-grade, highly scalable

**Learning Path**:
1. Understand embeddings (OpenAI text-embedding-3)
2. Set up local Chroma database
3. Store and query document embeddings
4. Implement semantic search
5. Optimize retrieval with metadata filtering

---

### 3.4 RAG (Retrieval Augmented Generation)

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | 94k+ | Complete LLM toolkit with RAG modules | Most popular |
| [run-llama/llama_index](https://github.com/run-llama/llama_index) | 36k+ | Leading framework for LLM-powered agents over data | Data focus |
| [deepset-ai/haystack](https://github.com/deepset-ai/haystack) | 17k+ | RAG framework for enterprise, production-ready | Enterprise |
| [infiniflow/ragflow](https://github.com/infiniflow/ragflow) | 18k+ | Open-source RAG engine with Agent capabilities | Advanced RAG |
| [Danielskry/Awesome-RAG](https://github.com/Danielskry/Awesome-RAG) | 1k+ | Curated list of RAG applications | Resource list |

**Advanced RAG Techniques (2024-2025)**:
- **GraphRAG**: Microsoft's knowledge graph-based retrieval
- **Corrective RAG (CRAG)**: Self-grading retrieval with quality thresholds
- **Agentic RAG**: Multi-agent collaboration for complex queries
- **Hybrid Search**: Combine semantic + keyword search

**Learning Path**:
1. **Week 1**: Understand RAG fundamentals
2. **Week 2**: Build basic RAG with LangChain
3. **Week 3**: Implement vector database integration
4. **Week 4**: Add document chunking strategies
5. **Week 5**: Implement reranking and filtering
6. **Week 6**: Build production RAG application

**Project Ideas**:
- Company knowledge base Q&A
- Legal document search
- Research paper assistant
- Code documentation search

---

### 3.5 Agentic Frameworks (LangChain & LangGraph)

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | 94k+ | Complete LLM toolkit (MIT license, 70k+ stars) | Most comprehensive |
| [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) | 6k+ | Build multi-agent applications with stateful workflows | Agentic systems |
| [deepset-ai/haystack](https://github.com/deepset-ai/haystack) | 17k+ | Composable pipelines for LLM applications | Enterprise |

**Key Concepts**:
- **Agents**: LLMs that can use tools and make decisions
- **Tools**: Functions agents can call (search, calculator, API calls)
- **Memory**: Short-term and long-term conversation memory
- **Chains**: Sequence of operations
- **Callbacks**: Monitor and debug agent behavior

**LangChain Components**:
- Prompts and prompt templates
- Output parsers
- Document loaders
- Text splitters
- Vector stores
- Retrievers
- Agents and agent executors

**LangGraph Features**:
- Stateful multi-agent workflows
- Human-in-the-loop
- Streaming support
- Persistence and checkpoints

**Learning Path**:
1. Master LangChain basics (prompts, chains)
2. Build simple agent with tools
3. Implement memory systems
4. Create multi-agent systems with LangGraph
5. Deploy production agent application

---

## Phase 4: Engineering in Production (MLOps)

**Timeline**: 3-4 months
**Focus**: Docker, Kubernetes, Cloud Platforms, ML Pipelines

### 4.1 Containerization (Docker & Kubernetes)

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [AlexIoannides/kubernetes-mlops](https://github.com/AlexIoannides/kubernetes-mlops) | 700+ | MLOps tutorial using Python, Docker, Kubernetes | Complete tutorial |
| [docker/awesome-compose](https://github.com/docker/awesome-compose) | 34k+ | Awesome Docker Compose samples | Docker learning |

**Key Concepts**:

**Docker**:
- Containerization basics
- Dockerfile creation
- Multi-stage builds
- Docker Compose for multi-container apps
- Container registries (Docker Hub, ECR)

**Kubernetes**:
- Pods, Deployments, Services
- ConfigMaps and Secrets
- Persistent Volumes
- Ingress controllers
- Helm charts

**Learning Path**:
1. Dockerize a simple ML model
2. Create multi-container app with Docker Compose
3. Deploy to local Kubernetes (Minikube/Kind)
4. Use Helm for deployment management
5. Set up monitoring and logging

---

### 4.2 Cloud Platforms

**Pick ONE major provider to start**:

| Platform | Best For | Key ML Services |
|----------|----------|-----------------|
| **AWS** | Most comprehensive | SageMaker, Bedrock, EC2, Lambda |
| **Azure** | Microsoft integration | Azure ML, OpenAI Service, Cognitive Services |
| **GCP** | TensorFlow, research | Vertex AI, AutoML, TPUs |

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [aws-samples/aws-machine-learning](https://github.com/aws-samples/aws-machine-learning) | Various | AWS ML samples and tutorials | AWS learning |
| [GoogleCloudPlatform/mlops-on-gcp](https://github.com/GoogleCloudPlatform/mlops-on-gcp) | 800+ | MLOps patterns on GCP | GCP learning |

**Key Services to Learn**:

**AWS**:
- SageMaker: Train and deploy models
- Bedrock: Foundation models
- Lambda: Serverless inference
- S3: Data storage
- ECR: Container registry

**GCP**:
- Vertex AI: Unified ML platform
- AutoML: No-code ML
- Cloud Functions: Serverless
- Cloud Storage: Data storage

**Azure**:
- Azure ML: End-to-end ML platform
- Azure OpenAI Service: GPT-4, DALL-E
- Functions: Serverless
- Blob Storage: Data storage

---

### 4.3 ML Pipelines & Automation

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [kubeflow/kubeflow](https://github.com/kubeflow/kubeflow) | 14k+ | ML toolkit for Kubernetes | Complete MLOps |
| [mlflow/mlflow](https://github.com/mlflow/mlflow) | 18k+ | Experiment tracking, model packaging, deployment | Experiment management |
| [iterative/dvc](https://github.com/iterative/dvc) | 13k+ | Data Version Control - Git for data | Data versioning |
| [zenml-io/zenml](https://github.com/zenml-io/zenml) | 4k+ | MLOps framework for production | Pipeline orchestration |

**Key Components**:

**Experiment Tracking (MLflow)**:
- Log parameters and metrics
- Compare experiments
- Model registry
- Deployment tracking

**Data Version Control (DVC)**:
- Version large datasets
- Reproducible pipelines
- Remote storage integration
- Experiment tracking

**Pipeline Orchestration (Kubeflow)**:
- Define ML workflows
- Component reusability
- Automated training
- Hyperparameter tuning
- Model deployment

**Learning Path**:
1. **Week 1-2**: MLflow for experiment tracking
2. **Week 3-4**: DVC for data versioning
3. **Week 5-6**: Build Kubeflow pipeline
4. **Week 7-8**: Automate CI/CD for ML
5. **Week 9-10**: Deploy production pipeline

**Project**: Build end-to-end ML pipeline with:
- Data ingestion and versioning (DVC)
- Automated training (Kubeflow)
- Experiment tracking (MLflow)
- Model deployment (Kubernetes)
- Monitoring (Prometheus + Grafana)

---

## Phase 5: State of the Art (Advanced)

**Timeline**: 2-3 months
**Focus**: Transformer Architecture, Fine-Tuning

### 5.1 Transformer Architecture

**Paper**: [Attention Is All You Need](https://arxiv.org/abs/1706.03762) (Vaswani et al., 2017)

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [hyunwoongko/transformer](https://github.com/hyunwoongko/transformer) | 2k+ | PyTorch implementation of "Attention Is All You Need" | Clean implementation |
| [jadore801120/attention-is-all-you-need-pytorch](https://github.com/jadore801120/attention-is-all-you-need-pytorch) | 8k+ | PyTorch Transformer implementation | Most popular |
| [Kyubyong/transformer](https://github.com/Kyubyong/transformer) | 4k+ | TensorFlow implementation | TensorFlow users |

**Key Concepts to Master**:
- **Self-Attention Mechanism**: How tokens attend to each other
- **Multi-Head Attention**: Parallel attention mechanisms
- **Positional Encoding**: Sequence order information
- **Feed-Forward Networks**: Position-wise transformations
- **Layer Normalization**: Stabilize training
- **Residual Connections**: Enable deep networks

**Visualizations**:
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) by Jay Alammar
- [Transformer Architecture visualization](https://bbycroft.net/llm)

**Learning Path**:
1. Read the original paper
2. Study The Illustrated Transformer
3. Implement attention mechanism from scratch
4. Build complete transformer for translation
5. Explore modern variants (GPT, BERT, T5)

---

### 5.2 Fine-Tuning Large Language Models

**GitHub Repositories**:

| Repository | Stars | Description | Best For |
|------------|-------|-------------|----------|
| [huggingface/peft](https://github.com/huggingface/peft) | 16k+ | State-of-the-art Parameter-Efficient Fine-Tuning | Official library |
| [gazelle93/llm-fine-tuning-sft-lora-qlora](https://github.com/gazelle93/llm-fine-tuning-sft-lora-qlora) | 500+ | Practical examples: SFT, LoRA, QLoRA with HF | Hands-on examples |
| [AdityaSagarr/LLM-Fine-Tuning](https://github.com/AdityaSagarr/LLM-Fine-Tuning) | 200+ | Fine-tuning with LoRA and qLoRA using Axolotl | Complete tutorial |

**Key Techniques**:

**Parameter-Efficient Fine-Tuning (PEFT)**:
- Train only 0.02% of parameters
- Maintain performance comparable to full fine-tuning
- Dramatically reduce compute and storage costs

**LoRA (Low-Rank Adaptation)**:
- Add trainable low-rank matrices
- Freeze base model weights
- Merge adapters during inference

**QLoRA (Quantized LoRA)**:
- 4-bit quantization of base model
- Train on consumer GPUs (24GB VRAM)
- Minimal performance degradation

**Full Fine-Tuning vs PEFT**:
| Method | Trainable Params | VRAM Required | Training Time |
|--------|------------------|---------------|---------------|
| Full Fine-Tuning | 100% | 80GB+ | Days |
| LoRA | 0.1-1% | 24-48GB | Hours |
| QLoRA | 0.1-1% | 12-24GB | Hours |

**Learning Path**:
1. Understand base model capabilities
2. Prepare and preprocess dataset
3. Implement LoRA fine-tuning with PEFT
4. Experiment with QLoRA for efficiency
5. Evaluate and deploy fine-tuned model

**Project Ideas**:
- Fine-tune Llama 2 on domain-specific data
- Create instruction-tuned model for tasks
- Build customer service chatbot
- Fine-tune for code generation

---

## Phase 6: Project Building

**Timeline**: Ongoing (iterative projects + 2 capstone projects)
**Focus**: Apply all learned skills in real-world projects

### 6.1 Iterative Projects (After Each Phase)

**Build small projects after finishing every phase above**:

**After Phase 1**:
- Data analysis dashboard with Pandas + Matplotlib
- Statistical modeling project
- SQL database design and queries

**After Phase 2**:
- Image classifier (dogs vs cats)
- Sentiment analysis model
- Time series forecasting

**After Phase 3**:
- RAG chatbot for documentation
- Personal knowledge base with semantic search
- Multi-agent task automation

**After Phase 4**:
- Dockerized ML API
- Deployed model on cloud platform
- CI/CD pipeline for ML model

**After Phase 5**:
- Fine-tuned LLM for specific domain
- Custom transformer implementation
- State-of-the-art model reproduction

---

### 6.2 Capstone Projects

**Build TWO large projects that combine everything**

**GitHub Repositories for Inspiration**:

| Repository | Stars | Description | Technologies |
|------------|-------|-------------|--------------|
| [GURPREETKAURJETHRA/END-TO-END-GENERATIVE-AI-PROJECTS](https://github.com/GURPREETKAURJETHRA/END-TO-END-GENERATIVE-AI-PROJECTS) | 1k+ | Industry projects with deployment | LangChain, RAG, LLMs |
| [nirmit27/genai-capstone-project-2025](https://github.com/nirmit27/genai-capstone-project-2025) | New | Gen AI Intensive Course capstone | Q&A, RAG, summarization |

**Capstone Project Requirements**:

**Project 1: Full-Stack GenAI Application with RAG**
- **Frontend**: React/Streamlit interface
- **Backend**: FastAPI with LangChain
- **Database**: PostgreSQL + Vector DB (Chroma/Pinecone)
- **ML**: Fine-tuned LLM or GPT-4 API
- **Features**:
  - User authentication
  - Document upload and processing
  - Semantic search with RAG
  - Chat interface with conversation memory
  - Admin dashboard
- **Deployment**: Docker + Kubernetes on AWS/GCP
- **Monitoring**: Prometheus + Grafana

**Project 2: Production MLOps Pipeline**
- **Data**: Version control with DVC
- **Training**: Automated pipeline with Kubeflow
- **Tracking**: Experiments with MLflow
- **Deployment**: Blue-green deployment on Kubernetes
- **Features**:
  - Automated retraining on new data
  - A/B testing for models
  - Real-time inference API
  - Model performance monitoring
  - Alerting for model drift
- **CI/CD**: GitHub Actions for automated testing and deployment

---

### 6.3 Example Capstone Project Ideas

**1. Enterprise Knowledge Base Assistant**
- RAG over company documents (PDFs, wikis, Confluence)
- Multi-tenant architecture
- Role-based access control
- Slack/Teams integration
- Analytics dashboard

**2. AI-Powered Customer Support**
- Fine-tuned LLM for company-specific responses
- Ticket classification and routing
- Automated responses with human-in-the-loop
- Sentiment analysis
- Integration with CRM

**3. Research Paper Analysis Platform**
- Semantic search over 1M+ papers
- Citation network analysis
- Automated literature review
- Paper summarization
- Recommendation system

**4. Code Assistant for Internal Codebase**
- Fine-tuned on company code
- Code search and documentation
- Code review suggestions
- Bug detection
- Test generation

**5. Healthcare Data Analysis Pipeline**
- HIPAA-compliant data handling
- Automated feature engineering
- Model training and validation
- Explainable AI (SHAP, LIME)
- Regulatory reporting

---

## Learning Paths

### 🚀 Fast Track (12 months, full-time)

| Month | Focus | Key Deliverables |
|-------|-------|------------------|
| 1-2 | Phase 1: Fundamentals | Math foundations, Python proficiency, SQL |
| 3-4 | Phase 2: ML Basics | 5 ML projects, scikit-learn mastery |
| 5-6 | Phase 2: Deep Learning | 3 DL projects, PyTorch proficiency |
| 7-8 | Phase 3: Generative AI | RAG application, LangChain projects |
| 9-10 | Phase 4: MLOps | Dockerized ML pipeline, cloud deployment |
| 11 | Phase 5: Advanced | Transformer implementation, fine-tuning |
| 12 | Phase 6: Capstone | 2 production-ready projects |

---

### 🎯 Balanced (18 months, part-time 20hrs/week)

| Months | Focus | Key Deliverables |
|--------|-------|------------------|
| 1-3 | Phase 1: Fundamentals | Solid foundation in math and programming |
| 4-7 | Phase 2: Machine Learning | Classical ML + Deep Learning mastery |
| 8-11 | Phase 3: Generative AI | LLM applications, RAG systems |
| 12-15 | Phase 4: MLOps | Production deployment skills |
| 16-17 | Phase 5: Advanced | State-of-the-art techniques |
| 18 | Phase 6: Capstone | 2 portfolio projects |

---

### 🐢 Thorough (24+ months, part-time 10hrs/week)

| Months | Focus | Weekly Hours | Notes |
|--------|-------|--------------|-------|
| 1-6 | Phase 1: Fundamentals | 10-12 | Deep understanding of math |
| 7-14 | Phase 2: Machine Learning | 12-15 | Many practice projects |
| 15-20 | Phase 3: Generative AI | 15-20 | Explore all frameworks |
| 21-24 | Phase 4: MLOps | 10-12 | Hands-on cloud experience |
| 25-26 | Phase 5: Advanced | 15-20 | Research papers |
| 27-30 | Phase 6: Capstone | 20-25 | Production-quality projects |

---

## Additional Resources

### 📚 Learning Platforms

**Free Resources**:
- [fast.ai](https://www.fast.ai/) - Practical Deep Learning
- [Hugging Face Course](https://huggingface.co/learn) - NLP and Transformers
- [Google's Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course)
- [Andrew Ng's Machine Learning Specialization](https://www.coursera.org/specializations/machine-learning-introduction)
- [Full Stack Deep Learning](https://fullstackdeeplearning.com/)

**Paid Resources**:
- [Coursera Deep Learning Specialization](https://www.coursera.org/specializations/deep-learning)
- [Udacity AI Programming Nanodegree](https://www.udacity.com/course/ai-programming-python-nanodegree--nd089)
- [DataCamp Career Tracks](https://www.datacamp.com/)

---

### 🎬 YouTube Channels

- [Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) - Neural Networks from scratch
- [Two Minute Papers](https://www.youtube.com/@TwoMinutePapers) - Latest AI research
- [Yannic Kilcher](https://www.youtube.com/@YannicKilcher) - Paper explanations
- [StatQuest](https://www.youtube.com/@statquest) - ML concepts with clarity
- [3Blue1Brown](https://www.youtube.com/@3blue1brown) - Math visualization

---

### 📰 Stay Updated

**Newsletters**:
- [The Batch](https://www.deeplearning.ai/the-batch/) by DeepLearning.AI
- [TLDR AI](https://tldr.tech/ai)
- [Import AI](https://jack-clark.net/)

**Communities**:
- [r/MachineLearning](https://www.reddit.com/r/MachineLearning/)
- [Hugging Face Forums](https://discuss.huggingface.co/)
- [MLOps Community](https://mlops.community/)
- [AI Stack Exchange](https://ai.stackexchange.com/)

**Papers & Research**:
- [Papers with Code](https://paperswithcode.com/)
- [arXiv.org](https://arxiv.org/list/cs.AI/recent)
- [Hugging Face Papers](https://huggingface.co/papers)

---

### 🏆 Competitions & Practice

- [Kaggle](https://www.kaggle.com/) - Data science competitions
- [LeetCode](https://leetcode.com/) - Coding practice
- [HackerRank AI](https://www.hackerrank.com/domains/ai) - AI challenges

---

## 🎓 Certification Paths

### Cloud Certifications

**AWS**:
- AWS Certified Machine Learning - Specialty
- AWS Certified Solutions Architect

**GCP**:
- Professional Machine Learning Engineer
- Professional Cloud Architect

**Azure**:
- Azure AI Engineer Associate
- Azure Data Scientist Associate

### General AI/ML Certifications

- TensorFlow Developer Certificate
- DeepLearning.AI TensorFlow Developer Professional Certificate
- IBM AI Engineering Professional Certificate

---

## 💡 Tips for Success

### 1. **Learn by Building**
Don't just watch tutorials. Build projects for every concept you learn.

### 2. **Focus on Fundamentals**
Strong math and programming foundations make advanced topics easier.

### 3. **One Thing at a Time**
Master one framework before learning another (PyTorch vs TensorFlow).

### 4. **Read Code**
Study implementations in the GitHub repos listed above.

### 5. **Contribute to Open Source**
Find bugs, improve docs, submit PRs to projects you use.

### 6. **Document Your Learning**
- Write blog posts explaining concepts
- Create tutorials for others
- Build a portfolio website

### 7. **Network**
- Attend local meetups
- Join online communities
- Participate in hackathons
- Connect on LinkedIn/Twitter

### 8. **Stay Current**
AI moves fast. Follow newsletters, read papers, watch conference talks.

### 9. **Don't Skip MLOps**
Many engineers focus only on modeling. Production skills make you valuable.

### 10. **Build in Public**
Share your projects on GitHub, write about your journey, help others.

---

## 📊 Skills Checklist

Use this checklist to track your progress:

### Phase 1: Fundamentals
- [ ] Linear Algebra (vectors, matrices, transformations)
- [ ] Calculus (derivatives, gradients, chain rule)
- [ ] Probability & Statistics
- [ ] Python (NumPy, Pandas, Matplotlib)
- [ ] SQL (joins, aggregations, subqueries)
- [ ] Data Structures & Algorithms

### Phase 2: Machine Learning
- [ ] Scikit-learn mastery
- [ ] Supervised learning algorithms
- [ ] Unsupervised learning
- [ ] Neural networks fundamentals
- [ ] PyTorch/TensorFlow proficiency
- [ ] CNNs for computer vision
- [ ] RNNs for sequences
- [ ] Transfer learning

### Phase 3: Generative AI
- [ ] OpenAI API usage
- [ ] Hugging Face ecosystem
- [ ] Embeddings and vector databases
- [ ] RAG implementation
- [ ] LangChain/LangGraph
- [ ] Prompt engineering
- [ ] Agentic systems

### Phase 4: MLOps
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] Cloud platform (AWS/GCP/Azure)
- [ ] MLflow experiment tracking
- [ ] DVC data versioning
- [ ] Kubeflow pipelines
- [ ] CI/CD for ML
- [ ] Model monitoring

### Phase 5: Advanced
- [ ] Transformer architecture
- [ ] Attention mechanisms
- [ ] Fine-tuning with LoRA/QLoRA
- [ ] PEFT techniques
- [ ] Model optimization
- [ ] Research paper implementation

### Phase 6: Projects
- [ ] 5+ small projects
- [ ] 2 capstone projects
- [ ] Deployed production application
- [ ] Portfolio website
- [ ] Technical blog posts
- [ ] Open source contributions

---

## 🚦 Getting Started TODAY

### Week 1 Action Plan:

**Monday-Tuesday**: Mathematics Foundation
- Watch 3Blue1Brown Linear Algebra (first 5 videos)
- Clone and explore fastai/numerical-linear-algebra

**Wednesday-Thursday**: Python Practice
- Complete 10 NumPy exercises
- Work through 5 Pandas tutorials
- Visualize data with Matplotlib

**Friday**: SQL
- Complete SQLBolt lessons 1-10
- Practice on sample database

**Weekend**: Data Structures
- Study 3 data structures from prabhupant/python-ds
- Solve 5 LeetCode easy problems
- Build a small project combining everything

---

## 📝 Summary

This roadmap provides a structured path from fundamentals to production-ready AI engineering. The key is **consistent practice** and **building projects** at every stage.

**Remember**:
- ✅ Start with strong foundations (Phase 1)
- ✅ Build many small projects before capstone
- ✅ Choose ONE framework/platform at a time
- ✅ Focus on production skills (MLOps) not just modeling
- ✅ Stay current with latest developments
- ✅ Contribute to open source
- ✅ Build in public and share your journey

**Your Next Steps**:
1. ⭐ Star the repositories you'll use
2. 📅 Create your personalized learning schedule
3. 🚀 Start with Week 1 Action Plan above
4. 📝 Set up a progress tracking system
5. 🤝 Join relevant communities
6. 🏗️ Build your first project this week

---

## 📞 Contributing

Found a great repository that should be added? Have suggestions for improvements?

**How to contribute**:
1. Open an issue with repository details
2. Include: URL, stars, brief description, why it's valuable
3. Specify which phase it belongs to

---

## 📜 License & Attribution

- **Video Source**: ["God Tier" AI Engineer Roadmap](https://www.youtube.com/watch?v=ewLJUvQbOu4)
- **Repository Curation**: Based on web research and GitHub exploration (Nov 2025)
- **Usage**: Free for educational and commercial use
- **Updates**: This guide will be updated quarterly with new repositories

---

**Last Updated**: 2025-11-18
**Total Repositories**: 60+
**Estimated Learning Time**: 12-24 months
**Target Audience**: Aspiring AI Engineers at all levels

**Good luck on your AI Engineering journey! 🚀🤖**
