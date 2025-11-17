# Humanoid Robots Software Stack & Programming Documentation

Comprehensive documentation of programming languages, frameworks, middleware, and software architectures used across major humanoid robot platforms.

---

## Table of Contents

1. [Tesla Optimus Gen 2](#tesla-optimus-gen-2)
2. [Boston Dynamics Atlas](#boston-dynamics-atlas)
3. [Figure 01 & Figure 02](#figure-01--figure-02)
4. [Unitree H1 & G1](#unitree-h1--g1)
5. [Sanctuary AI Phoenix](#sanctuary-ai-phoenix)
6. [1X Technologies (NEO & EVE)](#1x-technologies-neo--eve)
7. [Apptronik Apollo](#apptronik-apollo)
8. [Agility Robotics Digit](#agility-robotics-digit)
9. [Fourier Intelligence GR-1 & GR-2](#fourier-intelligence-gr-1--gr-2)
10. [UBTECH Walker Series](#ubtech-walker-series)
11. [Engineered Arts Ameca](#engineered-arts-ameca)
12. [PAL Robotics TALOS](#pal-robotics-talos)
13. [AgiBot X1](#agibot-x1)
14. [Xiaomi CyberOne](#xiaomi-cyberone)
15. [Clone Robotics](#clone-robotics)
16. [GitHub Repository Overview](#github-repository-overview)
17. [Industry-Wide Technologies](#industry-wide-technologies)
18. [AI/ML Frameworks](#aiml-frameworks)
19. [Simulation Platforms](#simulation-platforms)
20. [Communication Protocols & Middleware](#communication-protocols--middleware)
21. [Real-Time Operating Systems](#real-time-operating-systems)

---

## Tesla Optimus Gen 2

### Programming Languages
- **Primary:** C++ (C++14/17/20)
- **Secondary:** Python
- **Embedded Systems:** C/C++ for low-level control

### Software Architecture
- **Custom Stack:** Proprietary software stack (NOT ROS-based)
- **Philosophy:** Building from scratch rather than adopting ROS
- **Rationale:** Full control over performance and integration

### Technical Requirements
- **Real-time:** Embedded Linux systems
- **Cross-compilation:** For embedded Linux targets
- **Optimization Focus:**
  - Throughput
  - Latency
  - Correctness
  - Determinism
  - Memory efficiency

### Communication Standards
- **CAN Bus:** Controller Area Network
- **EtherCAT:** Real-time industrial Ethernet
- **Ethernet:** Standard networking

### Development Focus
- Multithreading
- Embedded systems software
- Fast, memory-efficient low-level code
- Balance, navigation, perception systems
- Physical world interaction

### Design Philosophy
Disappointed some robotics experts by not embracing ROS, potentially missing out on hundreds of engineering-years from the robotics community. However, allows Tesla to optimize specifically for their needs without ROS overhead.

---

## Boston Dynamics Atlas

### Programming Languages
- **Primary:** C++
- **Traditional Controllers:** C++ for detailed strategy implementation

### Control Systems

#### Model Predictive Control (MPC)
- Uses model of robot dynamics
- Predicts motion evolution into the future
- Deployed for:
  - Parkour
  - Dance
  - Manipulation
- Enables precise manipulation while maintaining balance
- Avoids self-collisions

### AI Integration (Recent)

#### Large Behavior Models (LBMs)
- **Partnership:** Toyota Research Institute (TRI) and Boston Dynamics
- **Input:** Images, proprioception, language prompts
- **Output:** Actions controlling full Atlas robot
- **Frequency:** 30Hz control loop
- **Technology:**
  - Diffusion transformer
  - Flow matching loss for training

### Historical Development
- **OpenHumanoids Platform:** Developed by MIT DRC team for DARPA Robotics Challenge
- **GitHub Repository:** Extensive C++ build dependencies
- **Software:** Proprietary and not publicly released

### Neural Network Integration
- Combines traditional MPC with modern neural network approaches
- Hybrid control architecture

---

## Figure 01 & Figure 02

### AI Framework

#### Vision Language Model (VLM)
- **Core Technology:** Neural network backbone
- **Capabilities:**
  - Process visual data in real-time
  - Comprehend language inputs
  - Scene understanding
  - Language comprehension

#### Historical AI Integration
- **Initial Partnership:** OpenAI large language models (ended 2025)
- **Reason for Ending:** LLMs "getting smarter yet more commoditized"

### Figure 02 - Helix System

#### Dual-System Architecture

**System 2 (High-Level Planning):**
- Operates at 7-9 Hz
- Vision-Language Model (VLM)
- Internet-scale VLM specialized in:
  - Scene understanding
  - Language comprehension
- High-level reasoning and planning

**System 1 (Low-Level Control):**
- Operates at 200 Hz
- Visuomotor policy
- Translates latent representations from S2 into continuous robot actions
- End-to-end trained communication between systems

#### Hardware
- **Two GPUs per robot**
- **GPU Type:** Nvidia RTX GPU-based modules
- **Performance:** 3x inference capability vs Figure 01

### Sensors
- **Figure 01:** Cameras, LiDAR, tactile sensors
- **Figure 02:** Six RGB cameras, onboard vision language model

### Programming Languages
- Not publicly disclosed
- Likely Python for AI/ML components
- Likely C++ for low-level control
- Custom integration framework

---

## Unitree H1 & G1

### SDK Support

#### unitree_sdk2
- **Platforms:** Go2, B2, H1, G1 robots
- **Languages:** C++ and Python
- **Control Frequency:** 2ms control loop
- **Python Version:** Requires Python 3.10 (strict requirement)

#### Python Interface
- **Package:** unitree_sdk2_python
- **Environment:** Virtual environment recommended
- **Basic Commands:**
  - walk
  - sit
  - stand up
  - damp

### ROS2 Integration

#### Full ROS2 Compatibility
- **Framework:** ROS2 native support
- **Communication:** Direct ROS2 msg usage
- **No SDK Wrapping:** Can use ROS2 directly for communication and control
- **Repositories:**
  - unitree_ros2 (official)
  - Community forks available

### AI Frameworks
- **PyTorch:** Supported
- **TensorFlow:** Supported
- **Deep Learning:** Full integration

### Simulation Support

#### MuJoCo Integration
- **Package:** unitree_mujoco
- **Capability:** Seamless transition from simulation to physical robot
- **SDK Integration:** Works with unitree_sdk2, unitree_ros2, unitree_sdk2_python

#### Other Simulators
- **Isaac Gym:** Supported
- **Gazebo:** Supported

### Development Workflow
1. Develop in simulation (MuJoCo, Isaac Gym, Gazebo)
2. Test with unitree_sdk2 or ROS2
3. Deploy directly to physical robot
4. SDK compatibility ensures smooth transition

### Documentation
- Mature development guides
- Sample code provided
- Active community support
- GitHub repositories with examples

---

## Sanctuary AI Phoenix

### Carbon AI Software Stack

#### Overview
- **Purpose:** Cognitive architecture for general-purpose humanoid robots
- **Capabilities:** Translate natural language into action in real world
- **Design:** Mimics subsystems found in human brain

#### Brain-Inspired Subsystems
- Memory
- Sight
- Sound
- Touch

### AI Integration

#### Large Language Models
- **Capability:** Query any publicly available LLM
- **Includes:** ChatGPT (OpenAI) and others
- **Approach:** Modular LLM integration

#### Reasoning Systems

**Symbolic and Logical Reasoning:**
- Explainable and auditable reasoning
- Task planning
- Motion planning
- Coupled with modern LLMs for general knowledge

**Domain-Specific Features:**
- Integrations and extensions
- Agency and goal-seeking behaviors

**Modern AI Techniques:**
- Deep Learning
- Reinforcement Learning

### Programming Languages
- **Not Publicly Disclosed:** Specific implementation languages unknown
- **Likely Stack:**
  - Python for AI/ML components
  - C++ for control systems
  - Custom integration layer

### Architecture Focus
- Cognitive architecture rather than traditional control
- AI-first design philosophy
- Human-like intelligence through Carbon system

---

## 1X Technologies (NEO & EVE)

### Neural Network Architecture

#### Single Vision-Based Neural Network (EVE)
- **Operating Frequency:** 10Hz
- **Control Scope:**
  - Driving
  - Arms
  - Gripper
  - Torso
  - Head
- **Key Feature:** No teleoperation, computer graphics, or scripted trajectories
- **Approach:** Pure neural network control

### Redwood AI Model (NEO)

#### Model Architecture
- **Type:** Vision-language transformer
- **Parameters:** 160M (small but efficient)
- **Form Factor:** Tailored for humanoid robots
- **Deployment:** Runs fully on NEO's onboard embedded GPU

#### Capabilities
- End-to-end mobile manipulation
- Retrieving objects for users
- Opening doors
- Navigating around the home
- Multiple cognitive tasks beyond action prediction

#### Technical Details

**Input Fusion:**
- Pre-trained language embeddings
- Vision tokens from pre-trained vision transformer
- Proprioception embeddings

**Output:**
- Diffusion policy for action decoding
- Generates EVE or NEO actions

**Efficiency:**
- Compute-efficient design
- Embedded GPU capable

### Voice Control System
- Natural language interface
- Chains short-horizon capabilities across multiple small models
- Plans to automate predictions using:
  - GPT-4o
  - VILA
  - Gemini Vision

### Programming Languages
- **Python:** Listed in technical areas
- **C++:** Listed in technical areas
- **Primary Paradigm:** Neural networks rather than traditional programming

### Development Philosophy
- Vision-language models for task planning
- Neural networks for execution
- End-to-end learning approaches
- Minimal traditional programming

---

## Apptronik Apollo

### Software Stack

#### Operating System & Framework
- **OS:** Linux
- **Framework:** Robot Operating System (ROS)
- **Architecture:** Open access to low-level control

### Integration Features
- **RT Linux/ROS Integration:** Real-time Linux with ROS
- **Libraries:** Open access to control software and libraries
- **Previous Platforms:** Consistent with Draco biped system architecture

### Software Suite
- Point-and-click control interface
- Humanoid robot fleet management
- Warehouse and manufacturing automation integration
- Wide range of solution deployment

### Processing Architecture

#### Onboard vs Cloud
- **Primary:** Most real-time processing onboard Apollo
- **Cloud:** Some fleet management and instructions
- **Focus:** Low compute, efficient algorithms

### Development Platform

#### Platform-Style Approach
- Similar to Boston Dynamics' Spot
- Allows development partners to create applications
- Base platform for custom development

### SDK & API
- **Status:** Not publicly detailed
- **Approach:** Partner development ecosystem
- **Architecture:** Modular and extensible

### Programming Languages
- **Likely:** C++ for control systems
- **Likely:** Python for high-level logic
- **Framework:** ROS-based (C++ and Python)

---

## Agility Robotics Digit

### Software Development

#### API Access
- **Local Interface:** Send commands to Digit locally
- **Web-Based Interface:** Remote control via web
- **Low-Level Code:** Option to write custom low-level code

#### Advanced Behaviors
- Stair climbing
- Footstep planning
- API-controlled behaviors
- Onboard and wireless API access

### ROS Integration

#### ROS1 Support
- **Distribution:** ROS Noetic
- **Build System:** catkin
- **Dependencies:** Digit API and Digit simulator

#### ROS2 Support
- **Workspaces:** ROS2 workspace for Digit control
- **Communication:** JSON API commands
- **Flexibility:** Both ROS1 and ROS2 available

### Programming Languages & Tools

#### Python
- **SDK:** agility-pysdk (Python SDK)
- **Distribution:** Wheel package
- **Primary Use:** High-level control and scripting

#### C++
- **Low-Level API:** Header and cpp files
- **Use Case:** Performance-critical control

#### JSON
- **API Commands:** JSON format
- **Communication:** Websocket server
- **External Inputs:** Keyboard and other inputs

#### TOML
- **Configuration:** Simulator configuration files
- **Settings:** Robot parameters

### Cloud Platform - Agility Arc

#### Features
- Brain behind Digit operations
- Cloud-based platform
- Deployment simplification
- Management tools
- System integration
- Fleet coordination

### Development Ecosystem
- Flexibility from high-level API to low-level control
- Simulator integration
- Community contributions (GitHub)
- Multiple abstraction levels for different use cases

---

## Fourier Intelligence GR-1 & GR-2

### Software Development Kit (SDK)

#### ROS Compatibility
- **Compatible with mainstream ROS**
- **GR-2:** Optimized development platform
- **API Access:** Intuitive APIs for developers

### Pre-Optimized Modules
- **Machine Vision:** Ready-to-use vision modules
- **Path Planning:** Navigation and planning
- **Force Feedback Control:** Haptic and force sensing

### Supported Frameworks

#### NVIDIA Isaac Lab
- GPU-accelerated simulation
- Reinforcement learning training
- Sim-to-real transfer

#### Mujoco
- Physics simulation
- Robot modeling
- Control testing

#### ROS (Robot Operating System)
- Industry-standard framework
- Community support
- Extensive libraries

### Programming and Teaching Modes

#### VR Telepresence
- Virtual reality control
- Immersive operation
- Remote manipulation

#### Direct Commands
- API-based control
- Programmatic interface
- Scripting support

#### Lead-Through Programming
- Physical demonstration
- Grab and move robot appendages
- Show what to do directly
- Intuitive teaching method

### Target Audience
- Commercial robotics development
- Academic research programs
- Learning platforms
- Open-source robotics tools

### Languages
- **Mainstream programming languages supported**
- **Likely:** Python, C++ (via ROS)

---

## UBTECH Walker Series

### SDK and Development

#### Walker S SDK
- **Language:** Open Python SDK
- **Third-Party Hardware Support:**
  - Micro Bit
  - Arduino
  - Raspberry Pi

#### Walker Research Version
- **Full SDK and APIs**
- **Suite:** Walker Software Suite
- **Research Focus:** Complete development access

### Walker E Development Suite

#### Open Interfaces
- **Motor Control:** Direct motor control APIs
- **Sensor Data:** Access to all sensor streams
- **Motion Control APIs:** High-level motion commands

#### ROS2 Compatibility
- Full ROS2 integration
- Standard ROS2 messaging
- Community ecosystem access

#### Development Resources
- **URDF Models:** High-precision robot models
- **Open Training Framework:** ML/RL training
- **KaiWu Platform Access:**
  - Robot trajectory data
  - Meta-skills library
  - Open operating system

#### Documentation
- Comprehensive development guides
- Mature sample code
- Embodied intelligence control
- Precision motion research examples

### Programming Platform

#### uCode
- **Purpose:** Easy programming for logistics and inspection
- **Use Cases:**
  - Warehouse tasks
  - Inspection routes
  - Automated workflows

### Research Applications
- Fully-programmable platform
- AI research
- Human-robot interaction studies
- Robotics research

---

## Engineered Arts Ameca

### Tritium Operating System

#### Version History
- **Current:** Tritium 2 (Gen 1)
- **Beta:** Tritium 3 (final stages of alpha testing)
- **Base:** Lightweight Linux-based OS
- **Tailored:** Specifically for robotics
- **Development:** 12 years of refinement

### Programming Languages

#### Python
- **Primary Language:** Creating control functions
- **Use Cases:** Custom subroutines
- **IDE:** Integrated developer environment
- **Access:** Full programming capability

#### C++
- **Support:** Full C++ support
- **Performance:** For critical operations
- **Integration:** Works with Python

#### Block-Based Coding
- **Visual Programming:** For accessibility
- **Education:** Learning-friendly
- **Rapid Prototyping:** Quick behavior creation

### API Access

#### RESTful API
- **Remote Control:** Almost everything controllable over web
- **Open API:** Developer access
- **Integration:** Easy third-party integration
- **Flexibility:** Multiple control options

### Development Tools

#### Virtual Robot
- **Purpose:** Generate movement animation
- **Calling Methods:**
  - Python
  - RESTful API
- **Platforms:**
  - Windows 10
  - Linux
- **Features:**
  - Cloud-based IDE
  - Robot simulator
  - Develop without hardware

### AI Integration

#### Cloud-Based Platform
- **AI-Driven Applications:** Support for modern AI
- **OpenAI GPT-4o:** Dynamic conversations and responses
- **Vision:** AI-powered visual understanding
- **NLP:** Natural language processing

### Development Environment
- Cloud-based IDE
- Simulator for testing
- No hardware required for development
- Web-based control and monitoring

---

## PAL Robotics TALOS

### ROS2 Software Development

#### Programming Languages
- **Primary:** Python and C++ (standard ROS2 languages)
- **Framework:** ROS2 native
- **Control:** ros2_control framework

### ros2_control Framework

#### Purpose
- **Motor Control:** Control moving motors
- **Sensor Reading:** Access sensor data
- **Standardization:** Easy setup for new robots
- **Tools:** Simplified robot setup

#### Historical Context
- **Legacy:** ros_control package widely used
- **Evolution:** Upgraded to ROS2
- **Industry Standard:** Common across robotics platforms

### Development Utilities

#### PAL Robotics Tools
- **launch_pal:** Simplify ROS2 launch operations
- **PAPS-007 Standard:** Configuration management
- **Documentation:** Comprehensive setup guides
- **Communication Setup:** ROS2 communication configuration

### Open Source Philosophy

#### GitHub Repositories
- **talos_robot:** Main robot repository
- **Open Modification:** Anyone can modify
- **Community Contributions:** Submit features and findings
- **Team Review:** Collaborative development

#### Transparency
- Public repositories
- Open source licensing
- Community engagement
- Collaborative improvement

### Robot Specifications
- **Height:** 1.75m
- **Capabilities:** Walk up to 3 km/h
- **Torque Sensors:** All joints
- **Control Frequency:** High-frequency motor control

---

## AgiBot X1

### Open Source Framework

#### AimRT Middleware
- **Foundation:** Built on AgiBot's open-source AimRT
- **Purpose:** Middleware for robot communication
- **Documentation:** Detailed tutorials on official website
- **Module Annotations:** Comprehensive development guide

### GitHub Repositories

#### 1. Inference Module
- **Repository:** agibot_x1_infer
- **URL:** https://github.com/AgibotTech/agibot_x1_infer
- **Contents:**
  - Model inference
  - Platform driver
  - Software simulation
  - Multiple functional modules

#### 2. Training Code
- **Repository:** agibot_x1_train
- **URL:** https://github.com/AgibotTech/agibot_x1_train
- **Contents:**
  - Reinforcement learning training code
  - Real-robot debugging
  - Simulated walking debugging
  - Works with inference software

#### 3. Hardware Design
- **Repository:** agibot_x1_hardware
- **URL:** https://github.com/AgibotTech/agibot_x1_hardware
- **Contents:**
  - BOM list
  - STEP files
  - SolidWorks drawings
  - SOP (Standard Operating Procedures)

### Documentation

#### Development Guide
- **URL:** https://www.agibot.com/DOCS
- **Content:** Detailed module annotations
- **Tutorials:** Step-by-step guides
- **API Reference:** Complete documentation

### Locomotion Control
- **Method:** Reinforcement Learning
- **Training:** Custom RL training code
- **Deployment:** Inference module for real-time control

### License
- **License:** MULAN license agreement
- **Type:** Open source
- **Freedom:** Modification and distribution allowed

### Download Options
- **Baidu Cloud:** For China users
- **Google Drive:** International access
- **GitHub:** Source code and documentation

### Programming Languages
- **Likely:** Python for RL training
- **Likely:** C++ for inference and control
- **Framework:** Custom AimRT middleware

---

## Xiaomi CyberOne

### Overview
CyberOne is Xiaomi's humanoid robot unveiled in Beijing in 2022. It is primarily a research demonstration and technology showcase rather than an open development platform.

### Software Development

#### SDK Availability
- **Status:** No publicly available SDK for CyberOne humanoid robot
- **Development:** Self-developed by Xiaomi Robotics Lab
- **Purpose:** Technology exploration and demonstration
- **Availability:** Not intended as open development platform

### Related Platform: CyberDog (Quadruped)

Note: CyberDog is Xiaomi's quadruped robot, NOT the humanoid CyberOne, but shares the "Cyber" branding.

#### MiRoboticsLab GitHub
- **Organization:** github.com/MiRoboticsLab
- **Repositories:** 30+ repositories for CyberDog platform
- **Key Repositories:**
  - cyberdog_ros2: Main ROS 2 packages
  - cyberdog_motor_sdk: Motor control SDK
  - cyberdog_mivins: Visual-inertial navigation system
  - Cyberdog_MD: Mechanical design files

### Technical Specifications (CyberOne)

#### Sensors
- Intel RealSense D455 RGB-D camera (head)
- Microstrain 3DM-GX5 IMU (torso)
- Rotary encoders (arms and legs)
- Custom force/torque sensors

#### Computing
- Dual Intel i7 Xeon quad-core computers
- Mi-Sense depth vision module (self-developed)

### Programming Languages
- **Not Publicly Disclosed:** Specific implementation languages unknown
- **Likely:** Python and C++ for development
- **Framework:** Proprietary

### Motors and Actuators
- Frameless torque motors in joint units
- Custom-developed joint motors
- 13 joints with 21 degrees of freedom

### Development Status
- **Closed Source:** Not available for external development
- **Purpose:** Technology demonstration
- **Commercial Availability:** Not for sale

---

## Clone Robotics

### Overview
Clone Robotics (founded 2021 in Poland) takes a unique biomimetic approach using proprietary artificial muscle technology called Myofibers.

### Proprietary Technology

#### Cybernet AI Model
- **Platform:** NVIDIA Jetson Thor GPU
- **Model:** Cybernet (visuomotor foundation model)
- **Approach:** End-to-end neural network control
- **Availability:** Proprietary, not publicly available

### Control System Architecture

#### Sensor System
- **Depth Cameras:** 4 cameras for vision
- **Inertial Sensors:** 70 sensors for joint-level feedback
- **Pressure Sensors:** 320 sensors for muscle force feedback
- **Integration:** Linked to microcontrollers

#### Processing
- Microcontrollers send sensor data to GPU
- NVIDIA Jetson Thor processes Cybernet model
- Real-time muscle control

### Myofiber Artificial Muscle Technology

#### Innovation (2021)
- Only artificial muscle achieving unique combination of:
  - Weight optimization
  - Power density
  - Speed
  - Force-to-weight ratio
  - Energy efficiency

#### Operation
- Water pressure-based contraction
- Biomimetic attachment to skeleton
- Mimics biological muscle-tendon systems

### Robot Models

#### Protoclone
- Based on natural human skeleton
- 1,000+ Myofibers for actuation
- 200+ degrees of freedom
- 500+ sensors

#### Clone Alpha
- Polymer skeleton (206 bone analogues)
- Hydraulic "vascular system"
- 500-watt compact pump
- Preorders accepted

### Software & Programming

#### SDK Availability
- **Status:** No public GitHub repositories
- **Software:** Proprietary Cybernet model
- **Development:** Closed source
- **Approach:** Internal development only

### Programming Languages
- **Not Publicly Disclosed:** Specific languages unknown
- **Neural Network Framework:** Likely PyTorch or TensorFlow
- **Control Software:** Proprietary

### Development Philosophy
- Biomimetic design (anatomy first, motion second)
- Proprietary technology
- Focus on artificial muscle innovation
- Closed ecosystem

---

## GitHub Repository Overview

### Fully Open Source Platforms

#### AgiBot X1
- **Organization:** github.com/AgibotTech
- **License:** MULAN open source license
- **Repositories:**
  - agibot_x1_infer (inference module)
  - agibot_x1_train (RL training code)
  - agibot_x1_hardware (mechanical design)
- **Documentation:** www.agibot.com/DOCS
- **Status:** Fully open for modification and distribution

#### Unitree H1 & G1
- **Organization:** github.com/unitreerobotics
- **Repositories:**
  - unitree_sdk2 (main SDK for Go2, B2, H1, G1)
  - unitree_sdk2_python (Python interface)
  - unitree_ros2 (ROS2 integration)
  - unitree_mujoco (simulation)
  - unitree_rl_lab (RL on IsaacLab)
  - unitree_il_lerobot (imitation learning with LeRobot)
  - xr_teleoperate (XR device teleoperation)
- **Status:** Active development, extensive SDK

#### PAL Robotics TALOS
- **Organization:** github.com/pal-robotics
- **Repositories:**
  - talos_robot (main robot repository)
  - launch_pal (ROS2 launch utilities)
  - ros2_control implementations
- **Status:** Open source, community contributions welcome
- **Documentation:** docs.pal-robotics.com

### Partial Open Source / Community Repositories

#### Boston Dynamics Atlas
- **OpenHumanoids Project:** github.com/openhumanoids/oh-distro
  - Developed by MIT and University of Edinburgh
  - For DARPA Robotics Challenge
  - Incomplete (Atlas software interface cannot be publicly released)
- **Boston Dynamics GitHub:** github.com/boston-dynamics
  - 4 repositories (mainly Spot-focused)
  - Spot RL Research Kit available

#### Agility Robotics Digit
- **Community Repositories:**
  - github.com/GTLIDAR/digit_controller
  - github.com/grantgib/digit_ros2 (ROS2 workspace for JSON API)
- **Official:** API access, not full open source
- **Status:** Developer-friendly but not fully open

#### Fourier Intelligence GR-1 & GR-2
- **SDK:** Compatible with ROS
- **GitHub Status:** Limited public repositories
- **Development Platform:** Open APIs and frameworks (ROS, MuJoCo, Isaac Lab)

### Proprietary / Closed Source Platforms

#### Tesla Optimus
- **GitHub:** No public repositories
- **Software:** Fully proprietary
- **Approach:** Custom stack, no ROS
- **Reasoning:** Full control, optimization

#### Boston Dynamics (Core Software)
- **Atlas Software:** Proprietary, not publicly released
- **Approach:** Commercial, closed ecosystem
- **Limited Release:** Some Spot tools only

#### Figure AI
- **Organization:** github.com/figurerobotics (51 repositories)
- **Official SDK:** Not released
- **Approach:** Proprietary Helix VLA
- **Third-Party:** Some community implementations (github.com/pie33000/helix)
- **Philosophy:** Vertical integration, closed development

#### Sanctuary AI Phoenix
- **Software:** Proprietary Carbon AI
- **GitHub:** No public repositories
- **Approach:** Closed cognitive architecture
- **Integration:** Can use public LLMs

#### 1X Technologies (NEO & EVE)
- **Software:** Proprietary Redwood AI model
- **GitHub:** No public repositories
- **Approach:** Neural network-based, closed source

#### Xiaomi CyberOne
- **Humanoid:** No public SDK or repositories
- **Quadruped (CyberDog):** github.com/MiRoboticsLab (30+ repos)
- **Approach:** Demonstration platform, not for developers

#### Clone Robotics
- **Software:** Proprietary Cybernet model
- **GitHub:** No public repositories
- **Approach:** Biomimetic proprietary technology

#### Apptronik Apollo
- **GitHub:** No official public SDK
- **Approach:** ROS-based with partner development
- **Platform:** Controlled access for partners

### Research & Academic Platforms

#### Awesome Humanoid Learning
- **Repository:** github.com/jonyzhang2023/awesome-humanoid-learning
- **Purpose:** Curated resources for humanoid robot development
- **Content:** Tracks developments across multiple platforms

#### Poppy Humanoid
- **Repository:** github.com/poppy-project/poppy-humanoid
- **Purpose:** Open-source 3D printed humanoid
- **Focus:** Research and education

#### Berkeley Humanoid Lite
- **Repository:** github.com/HybridRobotics/Berkeley-Humanoid-Lite
- **Purpose:** Academic research platform

### Open Source Frameworks & Libraries

#### LeRobot (HuggingFace)
- **Repository:** github.com/huggingface/lerobot
- **Purpose:** End-to-end learning for robotics
- **Integration:** Used with Unitree platforms

#### Humanoid-Gym
- **Organization:** github.com/roboterax/humanoid-gym
- **Purpose:** RL framework for humanoid locomotion
- **Base:** NVIDIA Isaac Gym
- **Features:** Zero-shot sim-to-real transfer

### Summary by Openness

**Fully Open (Source + Hardware):**
- AgiBot X1
- Unitree H1 & G1
- PAL Robotics TALOS

**Developer-Friendly (APIs/SDKs):**
- Agility Robotics Digit
- Fourier GR-1 & GR-2
- UBTECH Walker
- Engineered Arts Ameca

**Closed/Proprietary:**
- Tesla Optimus
- Boston Dynamics Atlas (core)
- Figure AI
- Sanctuary AI
- 1X Technologies
- Xiaomi CyberOne
- Clone Robotics
- Apptronik Apollo (partner only)

---

## Industry-Wide Technologies

### Robot Operating System (ROS)

#### ROS 1 (Robot Operating System)
- **Languages:** Primarily C++ and Python
- **Build System:** catkin
- **Distribution:** Various (Kinetic, Melodic, Noetic)
- **Status:** Mature, widely deployed
- **Use Cases:** Legacy systems, proven implementations

#### ROS 2 (Next Generation)
- **Languages:** C++ and Python
- **Build System:** colcon
- **Middleware:** DDS (Data Distribution Service)
- **Real-Time:** Better real-time support than ROS1
- **Security:** Improved security features
- **Distributions:** Foxy, Galactic, Humble, Iron, etc.

#### Advantages of ROS
- **Community:** Massive robotics community
- **Libraries:** Hundreds of pre-built packages
- **Sensors:** Drivers for most sensors
- **Visualization:** RViz for 3D visualization
- **Simulation:** Integration with simulators
- **Navigation:** Pre-built navigation stacks
- **Manipulation:** Arm control libraries (MoveIt)

#### ROS Adoption by Platform
- **Unitree:** Full ROS2 support
- **Fourier:** ROS compatible
- **UBTECH:** ROS2 support
- **PAL Robotics:** Native ROS2
- **Apptronik:** ROS-based
- **Agility:** ROS1 and ROS2
- **Tesla:** NOT using ROS (custom stack)
- **Boston Dynamics:** Proprietary (not ROS)

### Common Programming Languages

#### C++
- **Use Case:** Real-time control, performance-critical code
- **Advantages:**
  - Low latency
  - Deterministic behavior
  - Memory control
  - Hardware access
- **Typical Applications:**
  - Motor control loops
  - Sensor processing
  - Communication protocols
  - Embedded systems

#### Python
- **Use Case:** High-level logic, AI/ML, rapid prototyping
- **Advantages:**
  - Fast development
  - Rich AI/ML libraries
  - Easy debugging
  - Readable code
- **Typical Applications:**
  - AI model training
  - Behavior planning
  - Vision processing
  - API development

#### Other Languages
- **JavaScript/TypeScript:** Web interfaces
- **Rust:** Emerging for safety-critical systems
- **MATLAB:** Research and simulation
- **Julia:** High-performance computing

---

## AI/ML Frameworks

### Vision-Language-Action (VLA) Models

#### State-of-the-Art (2025)

**Dual-System Architecture:**
- **System 2 (VLM):** High-level reasoning (7-9 Hz)
- **System 1 (Action Expert):** Low-level control (100-200 Hz)
- **Communication:** End-to-end trained

**Leading Models:**
- **NVIDIA GR00T N1:** 2B parameter foundational model
- **Figure AI Helix:** Dual-system VLA for humanoids
- **π0 (Pi-Zero):** Flow-matching for continuous actions (50 Hz)

#### Technical Components

**Vision-Language Model (VLM):**
- Scene understanding
- Language comprehension
- Spatial reasoning
- Object recognition

**Action Decoder:**
- Diffusion Transformer
- Produces smooth motor actions at high frequency
- 120Hz control in advanced systems

### Deep Learning Frameworks

#### PyTorch
- **Primary Use:** Reinforcement learning
- **Advantages:**
  - Dynamic computation graphs
  - Easy debugging
  - Research-friendly
  - Strong community
- **Applications:**
  - Humanoid-Gym framework
  - RL training
  - VLA models
  - Policy learning

#### TensorFlow
- **Primary Use:** Production deployment
- **Advantages:**
  - Mature deployment tools
  - TensorFlow Lite for embedded
  - Strong production support
- **Applications:**
  - Vision systems
  - Production models
  - Edge deployment

### Reinforcement Learning

#### Frameworks
- **Humanoid-Gym:** Isaac Gym-based RL framework
  - Zero-shot sim-to-real transfer
  - PyTorch-based
  - Verified on real humanoid robots
  - Sim-to-sim framework (Isaac Gym to Mujoco)

#### Training Scale
- **Parallelization:** Thousands of environments
- **GPU Acceleration:** Multiple GPUs
- **Sample Collection:** Order of 10 billion samples
- **Training Time:** ~1 day for large-scale training

#### Neural Network Architectures
- **MLP:** Multi-Layer Perceptron
- **TCN:** Temporal Convolutional Networks
- **LSTM:** Long Short-Term Memory
- **Transformer:** Causal transformers for history
- **Diffusion Models:** For action generation

### Control Approaches

#### Model-Based
- **MPC (Model Predictive Control):** Boston Dynamics Atlas
- **Hybrid:** MPC + Neural Networks

#### Learning-Based
- **Pure RL:** Policy learning from scratch
- **Imitation Learning:** Learning from demonstrations
- **VLA:** Vision-language-action models

#### Trial and Error
- Reward signal optimization
- Policy gradient methods
- Actor-critic architectures

---

## Simulation Platforms

### Major Simulators

#### MuJoCo (Multi-Joint dynamics with Contact)
- **Type:** Physics engine
- **Specialty:** Reinforcement Learning
- **Speed:** Fast, real-time capable
- **Time Steps:** Up to 3ms valid results
- **Advantages:**
  - Specialized for RL
  - Fast simulation
  - Stable contact dynamics
  - Low computational cost
- **Use Cases:**
  - RL training
  - Policy development
  - Sim-to-real transfer
- **Supported By:**
  - Unitree (unitree_mujoco)
  - Fourier Intelligence
  - Research community

#### NVIDIA Isaac Sim/Isaac Gym
- **Type:** GPU-accelerated robotics simulator
- **Technology:**
  - Ray tracing
  - GPU physics
  - Massive parallelization
- **Advantages:**
  - Thousands of parallel environments
  - Fast RL training
  - Photorealistic rendering
  - ROS2 integration
- **Use Cases:**
  - Large-scale RL training
  - Humanoid-Gym framework
  - Sim-to-real research
- **Supported By:**
  - Fourier Intelligence (Isaac Lab)
  - Research institutions
  - NVIDIA GR00T development

#### Gazebo
- **Type:** Open-source robotics simulator
- **Integration:** Seamless ROS integration
- **Advantages:**
  - ROS native
  - Sensor modeling
  - Robust physics
  - Large community
  - Good for real system development
- **Use Cases:**
  - ROS development
  - Sensor testing
  - Navigation testing
  - Real robot preparation
- **Supported By:**
  - Unitree
  - ROS community
  - Academic institutions

#### PyBullet
- **Type:** Open-source physics engine
- **Language:** Python
- **Advantages:**
  - Easy to install
  - Well documented
  - Free and open source
  - Active community
  - Python native
- **Time Steps:** Up to 7ms valid results
- **Use Cases:**
  - RL research
  - Prototyping
  - Teaching
  - Quick experiments
- **Examples:**
  - TALOS humanoid reaching tasks
  - Balance maintenance

### Simulation Capabilities

#### Physics Simulation
- Rigid body dynamics
- Contact dynamics
- Friction models
- Joint constraints

#### Sensor Simulation
- RGB cameras
- Depth cameras
- LiDAR
- IMU
- Force/torque sensors

#### Rendering
- Photorealistic (Isaac Sim)
- Fast rendering (MuJoCo)
- Configurable quality

### Sim-to-Real Transfer

#### Humanoid-Gym Framework
- **Source Sim:** Isaac Gym
- **Target Sim:** Mujoco (verification)
- **Real Robot:** Zero-shot transfer
- **Verification:** Cross-simulator testing for robustness

#### Training Pipeline
1. Train in Isaac Gym (fast, parallel)
2. Verify in MuJoCo (different physics)
3. Deploy to real robot (zero-shot)
4. Fine-tune if needed

---

## Communication Protocols & Middleware

### EtherCAT (Ethernet for Control Automation Technology)

#### Overview
- **Developer:** Beckhoff Automation
- **Standard:** IEC 61158
- **Type:** Ethernet-based fieldbus

#### Performance
- **Update Times:** ≤ 100 μs
- **Jitter:** ≤ 1 μs
- **Real-Time:** Hard and soft real-time support
- **Synchronization:** Distributed clocks

#### Advantages for Humanoid Robotics
- Fast control loops
- Large data synchronization
- Complex servo control
- High-frequency motion control
- Deterministic communication

#### Use Cases
- **PAL TALOS:** Full EtherCAT communications (kHz control loops)
- **TOCABI Robot:** Parker/Kormollgen motors via Elmo controllers
- **Tesla Optimus:** EtherCAT for actuator communication
- **General:** Actuator networks, sensor networks

#### Integration with ROS2
- Seamless integration into ROS2 ecosystem
- High-frequency motion control
- Works alongside AI, vision, behavior planning nodes
- DDS middleware compatibility

### DDS (Data Distribution Service)

#### Overview
- **Standard:** OMG DDS standard
- **Use:** Distributed systems middleware
- **Selection:** Official ROS2 middleware

#### Advantages
- Publish-subscribe architecture
- Quality of Service (QoS) policies
- Discovery mechanism
- Real-time capable
- Scalable

#### ROS2 Integration
- Native ROS2 middleware
- Replaces ROS1 master
- Decentralized architecture
- Better real-time performance

### CAN Bus (Controller Area Network)

#### Overview
- **Type:** Vehicle bus standard
- **Layers:** Physical and data link
- **Use:** Distributed control

#### CANopen
- **Protocol:** Higher-level protocol on CAN
- **CoE:** CANopen over EtherCAT
- **Applications:** Actuator control, sensor networks

#### Use Cases
- Lower-level actuator control
- Embedded systems
- Safety-critical systems
- Automotive-derived robots

### Hybrid Middleware Architectures

#### OROCOS + ROS + EtherCAT
- **OROCOS:** Real-time control framework
- **ROS:** High-level planning
- **EtherCAT:** Low-level actuator control
- **OS:** Ubuntu with preemptible kernel
- **Result:** Deterministic real-time behavior

### Communication Hierarchy

**High-Level (1-30 Hz):**
- ROS2 topics (DDS)
- AI model inference
- Planning and decision making
- Vision processing

**Mid-Level (30-100 Hz):**
- Motion planning
- Trajectory generation
- Sensor fusion
- State estimation

**Low-Level (100-1000+ Hz):**
- Motor control
- Joint position control
- Force/torque control
- EtherCAT, CAN bus

---

## Real-Time Operating Systems

### Linux-Based Real-Time Systems

#### RT Linux (PREEMPT_RT)
- **Type:** Real-time patch for Linux
- **Kernel:** Preemptible kernel
- **Latency:** Low, deterministic
- **Use Cases:**
  - Humanoid robot control
  - Real-time motor control
  - Sensor processing

#### Real-Time Performance
- **50Hz:** Achievable on normal Linux
- **200Hz:** Achieved without RT kernel modifications
- **1000Hz+:** Requires RT Linux or RTOS

### Control Loop Frequencies

#### High-Level Control (1-30 Hz)
- **20Hz:** Sufficient for IMU-based balance (4.5ft humanoid)
- **10Hz:** EVE neural network control (1X Technologies)
- **30Hz:** Atlas LBM control (Boston Dynamics)

#### Mid-Level Control (30-200 Hz)
- **50Hz:** Motion planning, trajectory generation
- **100Hz:** State estimation, sensor fusion
- **200Hz:** Figure 02 System 1 (low-level control)

#### Low-Level Control (200-1000+ Hz)
- **500Hz:** Unitree G1 dual encoder control loop
- **1000Hz:** Fast robot dynamics, position tracking
- **kHz:** PAL TALOS EtherCAT control loops

### RTOS Options

#### Orocos (Open Robot Control Software)
- **Type:** Real-time robotics control framework
- **Maturity:** Mature and proven
- **Use Cases:** High-speed robotic manipulators
- **Requirements:** Hard real-time control

#### QNX
- **Type:** Commercial RTOS
- **Use:** Real robotics projects
- **Advantages:** Proven real-time performance
- **Licensing:** Commercial

#### Xenomai (formerly RTAI)
- **Type:** Real-time framework for Linux
- **Use:** Robotics projects
- **Advantages:** Linux compatibility with real-time

#### FreeRTOS
- **Type:** Market-leading embedded RTOS
- **Architectures:** 40+ processor architectures
- **Advantages:**
  - Small memory footprint
  - Fast execution
  - Open source
- **Use Cases:** Embedded motor controllers

### Real-Time Architecture Patterns

#### Dedicated CPU Approach
- **CPU 1:** Timing-sensitive control loops
- **CPU 2:** ROS, high-level logic
- **Communication:** Shared memory or fast IPC
- **Result:** Guaranteed real-time + flexible development

#### Hybrid OS Approach
- **RTOS:** Low-level motor control
- **Linux:** High-level planning, AI
- **Communication:** CAN, EtherCAT, shared memory

### Jitter Requirements
- **Critical Systems:** < 1 μs jitter
- **Motor Control:** 10-100 μs acceptable
- **High-Level:** Jitter less critical

---

## Development Ecosystems Comparison

### Closed/Proprietary Systems

#### Tesla Optimus
- **Approach:** Fully proprietary
- **Languages:** C++, Python
- **Framework:** Custom (no ROS)
- **Advantage:** Full control, optimized
- **Disadvantage:** No community leverage

#### Boston Dynamics Atlas
- **Approach:** Proprietary with research partnerships
- **Languages:** C++
- **Framework:** Custom MPC + LBMs
- **Advantage:** Cutting-edge performance
- **Disadvantage:** Not publicly available

#### Sanctuary AI Phoenix
- **Approach:** Proprietary Carbon AI
- **Integration:** Can use public LLMs
- **Advantage:** Cognitive architecture
- **Disadvantage:** Closed development

### Open/SDK-Based Systems

#### Unitree H1 & G1
- **Approach:** Open SDK (C++/Python)
- **Framework:** Full ROS2 support
- **Simulation:** MuJoCo, Isaac Gym, Gazebo
- **Community:** Active development
- **Advantage:** Maximum flexibility

#### AgiBot X1
- **Approach:** Fully open source
- **Repositories:** GitHub (inference, training, hardware)
- **License:** MULAN (open source)
- **Advantage:** Complete transparency

#### Fourier GR-1 & GR-2
- **Approach:** Open development platform
- **Framework:** ROS, Isaac Lab, MuJoCo
- **Teaching:** VR, direct command, lead-through
- **Advantage:** Multiple development methods

### Hybrid Systems

#### Apptronik Apollo
- **Approach:** ROS-based with partner development
- **Access:** Platform-style (like Spot)
- **API:** Open low-level access
- **Advantage:** Proven framework + custom apps

#### Agility Digit
- **Approach:** API access (local/web)
- **Framework:** ROS1 and ROS2 support
- **Cloud:** Agility Arc platform
- **Advantage:** Multiple abstraction levels

#### Engineered Arts Ameca
- **Approach:** Tritium OS with open API
- **Languages:** Python, C++, block coding
- **API:** RESTful API
- **Advantage:** Accessible + powerful

---

## Emerging Trends

### 1. Vision-Language-Action (VLA) Models
- **Dominance:** Becoming standard for humanoid AI
- **Architecture:** Dual-system (reasoning + action)
- **Frequency:** High-frequency action generation (50-200 Hz)
- **Training:** Large-scale pre-training + fine-tuning

### 2. End-to-End Learning
- **Approach:** Neural networks replacing traditional pipelines
- **Examples:** 1X EVE (10Hz neural network control)
- **Advantages:** Simplified architecture
- **Challenges:** Interpretability, safety guarantees

### 3. Sim-to-Real Transfer
- **Focus:** Zero-shot or few-shot transfer
- **Tools:** Humanoid-Gym, Isaac Sim
- **Verification:** Cross-simulator testing
- **Scale:** Billions of training samples in simulation

### 4. ROS2 Adoption
- **Trend:** Moving from ROS1 to ROS2
- **Drivers:** Real-time, security, DDS middleware
- **Exceptions:** Tesla (custom), Boston Dynamics (proprietary)

### 5. Open Source Movement
- **Examples:** AgiBot X1, Unitree platforms
- **Benefits:** Community development, rapid iteration
- **Challenges:** Hardware protection, business models

### 6. Hybrid Control Architectures
- **Pattern:** Combine MPC + RL + VLA
- **Advantages:** Leverage strengths of each approach
- **Examples:** Boston Dynamics Atlas (MPC + LBM)

### 7. GPU-Accelerated Simulation
- **Tools:** Isaac Gym/Sim, CUDA-based physics
- **Scale:** 1000s of parallel environments
- **Impact:** Faster RL training, better policies

### 8. Modular Software Architectures
- **Trend:** Plugin-based, composable systems
- **Examples:** ROS2 composition, behavior trees
- **Advantages:** Reusability, testing, maintenance

### 9. Cloud-Robot Integration
- **Examples:** Agility Arc, Sanctuary Carbon
- **Capabilities:** Fleet management, updates, telemetry
- **Challenges:** Latency, connectivity, security

### 10. Diffusion Policies
- **Adoption:** Increasingly popular for action generation
- **Advantages:** Smooth, continuous actions
- **Frequency:** 50-200 Hz action generation
- **Examples:** π0, Helix System 1, Redwood

---

## Best Practices

### Language Selection

**C++ When:**
- Real-time control loops required
- Low latency critical
- Embedded systems
- Motor control
- Safety-critical systems

**Python When:**
- Rapid prototyping
- AI/ML development
- High-level logic
- Vision processing
- Research and experimentation

**Both When:**
- ROS/ROS2 development
- Hybrid systems
- Large projects with different requirements

### Framework Selection

**Choose ROS2 When:**
- Standard robotics application
- Need community packages
- Multiple sensors/actuators
- Want proven navigation/manipulation
- Open source project

**Choose Custom When:**
- Extreme performance requirements
- Proprietary technology
- Specific optimization needs
- Large engineering team
- Example: Tesla Optimus

### Simulation Selection

**MuJoCo For:**
- Reinforcement learning
- Fast iteration
- Sim-to-real research
- Contact-rich tasks

**Isaac Sim/Gym For:**
- Large-scale RL training
- GPU acceleration needed
- Photorealistic rendering
- NVIDIA ecosystem

**Gazebo For:**
- ROS integration critical
- Sensor testing
- Real robot preparation
- Community support

**PyBullet For:**
- Python development
- Learning/teaching
- Quick prototyping
- Free/open source requirement

### Real-Time Considerations

**For Control Loops:**
- 10-30 Hz: Normal Linux sufficient
- 30-200 Hz: Consider RT Linux
- 200-1000+ Hz: Use RTOS or RT Linux
- Critical systems: Dedicated CPU or RTOS

**Jitter Management:**
- Use real-time kernels
- Dedicated CPU cores
- Proper scheduling priorities
- Avoid blocking operations in RT loops

---

## Conclusion

The humanoid robotics software landscape in 2025 is characterized by:

### Dominant Patterns
1. **ROS2 Adoption:** Industry standard except for Tesla and Boston Dynamics
2. **VLA Models:** Vision-Language-Action becoming standard for AI
3. **Hybrid Architectures:** Combining classical control with modern AI
4. **Sim-to-Real:** Heavy emphasis on simulation-based training

### Language Preferences
- **C++:** Low-level control, real-time systems
- **Python:** AI/ML, high-level logic, rapid development
- **Both:** Most platforms support both languages

### Key Technologies
- **Middleware:** ROS2 (DDS), EtherCAT for real-time
- **AI:** PyTorch for research, TensorFlow for production
- **Simulation:** MuJoCo, Isaac Sim, Gazebo
- **Control:** MPC + RL + VLA hybrid approaches

### Open vs Proprietary
- **Open Source:** Unitree, AgiBot, Fourier (gaining momentum)
- **Proprietary:** Tesla, Boston Dynamics (performance leaders)
- **Hybrid:** Most others (open APIs, closed core)

### Future Directions
- Increased VLA adoption
- Better sim-to-real transfer
- More open source platforms
- Cloud-robot integration
- Edge AI deployment

The field is rapidly evolving with significant innovation in both classical robotics and modern AI approaches, creating increasingly capable and autonomous humanoid robots.

---

*Last Updated: 2025*
*Sources: Public documentation, GitHub repositories, research papers, company announcements, and developer resources*
