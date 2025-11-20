# Drone Technology: Top GitHub Repositories

A curated collection of the best open-source repositories for drone technology, covering autopilot systems, computer vision, simulators, and supporting tools.

---

## Table of Contents
1. [Autopilot & Flight Control Systems](#autopilot--flight-control-systems)
2. [Ground Control Stations](#ground-control-stations)
3. [Computer Vision & Object Detection](#computer-vision--object-detection)
4. [Simulators](#simulators)
5. [Mapping & Photogrammetry](#mapping--photogrammetry)
6. [Communication Protocols](#communication-protocols)
7. [Autonomous Navigation](#autonomous-navigation)

---

## Autopilot & Flight Control Systems

### 1. PX4 Autopilot
**Repository:** [PX4/PX4-Autopilot](https://github.com/PX4/PX4-Autopilot)
- **Stars:** 10.5k+ | **Forks:** 14.7k+
- **Description:** Professional open-source autopilot stack, part of the Dronecode project
- **Language:** C++
- **Key Features:**
  - Supports multiple vehicle types (multi-rotors, fixed-wing, VTOL)
  - Real-time operating system (NuttX)
  - Advanced control algorithms
  - Extensive sensor support
  - Active development and large community
- **Use Case:** Professional drone applications, research, commercial drones

### 2. ArduPilot
**Repository:** [ArduPilot/ardupilot](https://github.com/ArduPilot/ardupilot)
- **Description:** Advanced, full-featured, and reliable open-source autopilot
- **Language:** C++
- **Key Features:**
  - Supports rovers, boats, submarines, helicopters, planes, and multi-copters
  - Mission Planner ground control station
  - Extensive community and documentation
  - Hardware abstraction layer
- **Use Case:** Versatile platform for various autonomous vehicles

### 3. Paparazzi UAV
**Repository:** [paparazzi/paparazzi](https://github.com/paparazzi/paparazzi)
- **Stars:** 1.6k+ | **Last Updated:** Nov 2025
- **License:** GPLv2
- **Description:** Free and open-source hardware and software for UAVs
- **Key Features:**
  - Primary focus on autonomous flight
  - Portable for field operations
  - Combined hardware and software project
  - Research-oriented
- **Use Case:** Research, educational projects, custom UAV development

### 4. DronePilot
**Repository:** [alduxvm/DronePilot](https://github.com/alduxvm/DronePilot)
- **Description:** Automatic pilot supporting multiple flight controllers
- **Key Features:**
  - Uses DroneKit for Pixhawk and PX4
  - Supports Pixhawk, APM, and MultiWii
  - Advanced mission capabilities
- **Use Case:** Multi-platform drone control applications

---

## Ground Control Stations

### 5. QGroundControl
**Repository:** [mavlink/qgroundcontrol](https://github.com/mavlink/qgroundcontrol)
- **Description:** Cross-platform ground control station
- **Platforms:** Android, iOS, Mac OS, Linux, Windows
- **Key Features:**
  - Mission planning
  - Flight control
  - Parameter configuration
  - Real-time telemetry
  - Video streaming support
- **Use Case:** Universal GCS for PX4 and ArduPilot drones

### 6. Mission Planner
**Repository:** [ArduPilot/MissionPlanner](https://github.com/ArduPilot/MissionPlanner)
- **Stars:** 1.6k+
- **Platform:** Windows (with Mono support for Linux/Mac)
- **Description:** Full-featured GCS for ArduPilot
- **Key Features:**
  - Mission planning and waypoint management
  - Flight data analysis
  - Parameter tuning
  - Log analysis
- **Use Case:** ArduPilot-based drone operations

### 7. ASV Drones GCS
**Repository:** [asv-soft/asv-drones](https://github.com/asv-soft/asv-drones)
- **Description:** Open-source ground control station for ArduPilot and PX4
- **Key Features:**
  - Modern user interface
  - Support for both major autopilot systems
- **Use Case:** Alternative GCS with modern UI

---

## Computer Vision & Object Detection

### 8. Drone Detection & Tracking (YOLOv3 + GOTURN)
**Repository:** [tau-adl/Detection_Tracking_JetsonTX2](https://github.com/tau-adl/Detection_Tracking_JetsonTX2)
- **Description:** Real-time drone visual detection and tracking on Jetson TX2
- **Algorithms:** YOLOv3 for detection, GOTURN for tracking
- **Key Features:**
  - Autonomous real-time detection
  - Hostile drone tracking from surveillance drones
  - Optimized for embedded systems (Jetson TX2)
- **Use Case:** Counter-drone systems, drone-based surveillance

### 9. Drone Detection YOLOv11x
**Repository:** [doguilmak/Drone-Detection-YOLOv11x](https://github.com/doguilmak/Drone-Detection-YOLOv11x)
- **Description:** Real-time drone detection using latest YOLOv11x
- **Key Features:**
  - C3k2 blocks and SPPF architecture
  - C2PSA spatial attention
  - Heatmap visualization
  - Optimized for small, fast-moving targets
  - Trained on custom UAV dataset
- **Use Case:** Drone detection in complex environments

### 10. DroTrack
**Repository:** [cruiseresearchgroup/DroTrack](https://github.com/cruiseresearchgroup/DroTrack)
- **Description:** High-speed drone-based object tracking under uncertainty
- **Performance:** Up to 1000 fps
- **Key Features:**
  - Ultra-fast tracking framework
  - Handles uncertainty in drone-captured videos
  - Real-time performance
- **Use Case:** High-speed tracking applications, sports analysis

### 11. VisDrone Dataset
**Repository:** [VisDrone/VisDrone-Dataset](https://github.com/VisDrone/VisDrone-Dataset)
- **Description:** Comprehensive dataset for drone-based detection and tracking
- **Contents:** Images, videos, and annotations
- **Key Features:**
  - Large-scale benchmark dataset
  - Multiple object categories
  - Challenging scenarios (crowds, occlusion, varying scales)
- **Use Case:** Training and benchmarking computer vision models

---

## Simulators

### 12. RotorS Simulator
**Repository:** [ethz-asl/rotors_simulator](https://github.com/ethz-asl/rotors_simulator)
- **Description:** UAV Gazebo simulator from ETH Zurich
- **Platform:** ROS + Gazebo
- **Key Features:**
  - Modular MAV simulation framework
  - Physics-based simulation
  - Multiple UAV models
  - Sensor simulation
- **Use Case:** Academic research, algorithm development

### 13. UAV Simulator (Lightweight)
**Repository:** [Zhefan-Xu/uav_simulator](https://github.com/Zhefan-Xu/uav_simulator)
- **Description:** Lightweight Gazebo/ROS-based simulator
- **Language:** C++
- **Platform:** ROS Melodic/Noetic, Gazebo
- **Key Features:**
  - Optional PX4 integration
  - Static and dynamic obstacle simulation
  - Lightweight and fast
  - Easy setup
- **Use Case:** Quick prototyping, algorithm testing

### 14. SJTU Drone
**Repository:** [NovoG93/sjtu_drone](https://github.com/NovoG93/sjtu_drone)
- **Description:** ROS/ROS 2 Gazebo quadcopter simulator
- **Platform:** ROS 2 (Ubuntu 22.04) + Gazebo 11
- **Key Features:**
  - ROS 2 support
  - Forked from tum_simulator
  - Modern ROS compatibility
- **Use Case:** ROS 2 development, education

### 15. AirSim
**Repository:** [microsoft/AirSim](https://github.com/microsoft/AirSim)
- **Description:** Open-source simulator for autonomous vehicles
- **Engine:** Unreal Engine / Unity
- **Key Features:**
  - Photorealistic environments
  - Multiple sensor simulation (cameras, LiDAR, IMU)
  - Hardware-in-loop support
  - ROS integration available
  - Deep learning integration
- **Use Case:** AI/ML training, realistic simulation, computer vision

### 16. Autonomous Drone SITL
**Repository:** [pratik7229/Autonomous_Drone_using_SITL_ROS_and-gazebo_simulation](https://github.com/pratik7229/Autonomous_Drone_using_SITL_ROS_and-gazebo_simulation)
- **Description:** Comprehensive drone programming tutorial
- **Technologies:** SITL, ROS, mavros, Gazebo
- **Key Features:**
  - Complete learning resource
  - DroneKit and pymavlink integration
  - Step-by-step tutorials
- **Use Case:** Learning drone programming, software-in-the-loop testing

---

## Mapping & Photogrammetry

### 17. OpenDroneMap (WebODM)
**Repository:** [OpenDroneMap/WebODM](https://github.com/OpenDroneMap/WebODM)
- **Stars:** 3,452+ | **Last Updated:** Nov 2025
- **Description:** User-friendly, commercial-grade drone imagery processing
- **Key Features:**
  - Web-based interface
  - Point cloud generation
  - 3D model creation
  - Digital elevation models (DEMs)
  - Orthophoto map generation
  - Command-line toolkit
- **Use Case:** Surveying, mapping, 3D reconstruction, agriculture

---

## Communication Protocols

### 18. MAVLink
**Repository:** [mavlink/mavlink](https://github.com/mavlink/mavlink)
- **Description:** Micro Air Vehicle Message Marshalling Library
- **Key Features:**
  - Lightweight messaging protocol
  - Binary serialization
  - Language bindings (C, C++, Python, Java, etc.)
  - Standard for drone communication
- **Use Case:** Drone-GCS communication, telemetry

### 19. MAVROS
**Repository:** [mavlink/mavros](https://github.com/mavlink/mavros)
- **Description:** MAVLink to ROS gateway
- **Key Features:**
  - Proxy for Ground Control Station
  - ROS node for MAVLink communication
  - Extensive message conversion
  - Plugin architecture
- **Use Case:** ROS-based drone applications

---

## Autonomous Navigation

### 20. Autonomous Drone Delivery
**Repository:** [szebedy/autonomous-drone](https://github.com/szebedy/autonomous-drone)
- **Description:** Autonomous delivery system for Intel Aero RTF with PX4
- **Platform:** ROS + Gazebo simulation / Real hardware
- **Key Features:**
  - SVO 2.0 for visual odometry
  - WhyCon for visual marker localization
  - Ewok for trajectory planning with collision avoidance
  - Full simulation and real-world support
- **Use Case:** Autonomous delivery, waypoint navigation

### 21. GAAS (Generalized Autonomy Aviation System)
**Repository:** [generalized-intelligence/GAAS](https://github.com/generalized-intelligence/GAAS)
- **Description:** Open-source program for fully autonomous VTOL and drones
- **Key Features:**
  - Complete autonomy stack
  - SLAM and navigation
  - Perception systems
  - Mission planning
- **Use Case:** Fully autonomous flying vehicles, advanced research

---

## Additional Resources

### Awesome Drones
**Repository:** [janesmae/awesome-drones](https://github.com/janesmae/awesome-drones)
- **Description:** Curated list of awesome drone resources
- **Contents:** Software, hardware, courses, books, and communities

---

## Summary by Category

| Category | Number of Projects | Key Technologies |
|----------|-------------------|------------------|
| Autopilot Systems | 4 | PX4, ArduPilot, Paparazzi, DroneKit |
| Ground Control | 3 | Qt, .NET, MAVLink |
| Computer Vision | 4 | YOLO, GOTURN, Deep Learning |
| Simulators | 5 | Gazebo, ROS, Unreal Engine |
| Mapping | 1 | Photogrammetry, OpenCV |
| Communication | 2 | MAVLink, ROS |
| Autonomous Nav | 2 | SLAM, Visual Odometry, Planning |

**Total Repositories:** 21+ specialized drone technology projects

---

## Technology Stack Overview

**Core Technologies:**
- **Languages:** C++, Python, C
- **Frameworks:** ROS/ROS 2, Qt
- **Simulators:** Gazebo, Unreal Engine, Unity
- **Protocols:** MAVLink, UDP, TCP
- **Computer Vision:** OpenCV, YOLO, TensorFlow, PyTorch
- **RTOS:** NuttX, Linux

**Hardware Platforms:**
- Pixhawk family
- Intel Aero
- Jetson TX2/Nano/Orin
- Raspberry Pi
- Generic Linux boards

---

*Last Updated: November 2025*
