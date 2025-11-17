# Humanoid Robots Technical Documentation

Comprehensive technical documentation for humanoid robots, focusing on components, actuators, gears, and production processes.

---

## Table of Contents

1. [Tesla Optimus Gen 2](#tesla-optimus-gen-2)
2. [Boston Dynamics Atlas](#boston-dynamics-atlas)
3. [Figure 01](#figure-01)
4. [Unitree H1 & G1](#unitree-h1--g1)
5. [Sanctuary AI Phoenix](#sanctuary-ai-phoenix)
6. [1X Technologies (NEO & EVE)](#1x-technologies-neo--eve)
7. [Apptronik Apollo](#apptronik-apollo)
8. [Agility Robotics Digit](#agility-robotics-digit)
9. [Fourier Intelligence GR-1 & GR-2](#fourier-intelligence-gr-1--gr-2)
10. [UBTECH Walker Series](#ubtech-walker-series)
11. [Engineered Arts Ameca](#engineered-arts-ameca)
12. [Xiaomi CyberOne](#xiaomi-cyberone)
13. [Clone Robotics (Protoclone & Clone Alpha)](#clone-robotics-protoclone--clone-alpha)
14. [AgiBot X1](#agibot-x1)
15. [PAL Robotics TALOS](#pal-robotics-talos)
16. [Understanding Humanoid Robot Gearing Systems](#understanding-humanoid-robot-gearing-systems)

---

## Tesla Optimus Gen 2

### Overview
Advanced humanoid robot featuring 30% faster movement speed, 22-pound weight reduction, and enhanced AI capabilities compared to its predecessor.

### Physical Specifications
- **Height/Weight:** Not publicly disclosed for Gen 2
- **Degrees of Freedom:** 28 DOF total
  - Highly dexterous hands with 11 DOF each
  - 2-DOF actuated neck

### Actuator Systems

#### Rotary Actuators (3 types)
**Configuration:**
- Frameless torque motor × 1
- Harmonic reducer × 1
- Torque sensor × 1
- Encoder × 2
- Driver × 1
- Cross roller bearing × 1
- Angular contact ball bearing × 1

#### Linear Actuators (3 types)
**Configuration:**
- Frameless torque motor × 1
- Planetary roller screw × 1
- Force sensor × 1
- Encoder × 1
- Driver × 1
- Ball bearing × 1
- Four-point contact ball bearing × 1

### Gearing Systems
- **Type:** Harmonic reducer (strain wave gearing)
- **Features:**
  - Simple structure
  - High reduction ratio
  - High transmission accuracy
  - High transmission efficiency
  - Works in conjunction with rotor for exceptional precision

### Sensors
- **Position Detection:** Magnets coupled to outer surface of rotor
- **Force Monitoring:** Dedicated force sensor attached to main shaft
- **Position Tracking:** Position sensor attached to enclosure for angular position
- **Tactile Sensing:** All fingers equipped with tactile sensors
- **Fingertip Sensors:** Tesla-designed sensors

### Hand Design
- 11 degrees of freedom per hand
- Tactile sensing on all fingers
- Capable of handling delicate objects like eggs

### Foot Design
- Human-like foot shape
- Articulated toe sections
- Force/torque sensors integrated

### Performance
- Walking speed: Up to 8.05 km/h
- Enhanced balance and stability
- Real-time adaptation to varying load conditions

### Production Timeline
- **July 2025:** Announced "low production for Tesla internal use next year"
- **2026:** Planned broader availability

---

## Boston Dynamics Atlas

### Hydraulic Atlas (HD Atlas - Retired April 2024)

#### Physical Specifications
- **Height:** 150 cm (4 ft 11 in)
- **Weight:** 80 kg (176 lb)
- **Degrees of Freedom:** 28 DOF total
  - 6 DOF per leg
  - 6 DOF per arm
  - 3 DOF for back joints
  - 1 DOF for neck pitch

#### Actuators
- **Type:** Hydraulic actuators (28 total)
- **Technology:** Cylinders filled with pressurized fluid driving pistons
- **Servo Valves:** Custom valves significantly smaller and lighter than aerospace models
- **Performance:** High performance enabling explosive strength for acrobatic leaps and flips

#### Materials & Construction
- Titanium and aluminum 3D printed parts
- Impressive strength-to-weight ratio
- Custom engineering for athletic performance

#### Sensing Systems
- RGB cameras
- Depth sensors
- Provide input to control system

#### Power
- Battery-powered
- Hydraulically actuated

### Electric Atlas (Introduced April 2024)

#### Actuation System
- **Type:** Custom high-powered electric actuators
- **Distribution:** Throughout robot's body
- **Advantages:**
  - Lighter than hydraulic version
  - More compact
  - Stronger and more dexterous
  - Unprecedented flexibility

#### Hand Design
- **Degrees of Freedom:** 7 DOF total per hand
- **Actuators:** 7 actuators per hand
  - 2 actuators per finger
  - Articulated thumb joint

---

## Figure 01

### Overview
Standing at 5 feet 8 inches and weighing around 130 pounds, Figure 01 is battery-powered and built to handle tasks like walking, lifting and moving objects.

### Design Philosophy
- Almost entirely designed from scratch
- Custom actuators, motors, sensors, battery pack, and electronics
- Focus on solid engineering rather than secret actuator technology
- Not based on breakthrough technology, emphasizes proven engineering

### Technology Components
- **Vision:** Cameras
- **Perception:** LiDAR sensors
- **Touch:** Tactile sensors
- **Movement:** Complex system of joints and actuators
- **Dexterity:** Replicate human dexterity by converting energy into mechanical force

### Manufacturing - BotQ Facility

#### Capacity
- First generation line: Up to 12,000 humanoids per year
- High-volume manufacturing facility

#### In-House Assembly Strategy
**Core technology assembled in-house:**
- Actuators
- Hands
- Batteries
- Final assembly

**Outside vendors for:**
- Piece part manufacturing

#### Challenges
- Lack of mature supply chain
- Determining sourcing for components at scale
- Defining manufacturing processes and locations

### Component Requirements
- Expensive components: actuators, motors, sensors
- Custom engineering for most parts

---

## Unitree H1 & G1

### Unitree H1

#### Physical Specifications
- **Height:** Approximately 1.8 meters
- **Weight:** 47 kg
- **Degrees of Freedom:**
  - 7 DOF arms
  - 6 DOF legs
  - Optional dexterous hands

#### Actuator Performance
**Joint Torque Capabilities:**
- **Knee:** 360 N·m
- **Hip:** 220 N·m
- **Waist:** 220 N·m
- **Ankle:** ~75 N·m peak torque
- **Shoulder:** ~120 N·m
- **Elbow:** ~120 N·m
- **Wrist:** ~30 N·m

**Overall:** High-torque actuators capable of delivering joint torques up to 360 N·m

#### Computing & Sensors
**Computing:**
- Intel Core i5 (platform function) or i7 (user development)
- Optional NVIDIA Jetson Orin NX 16GB delivering 100 TOPS

**Sensors:**
- Intel RealSense D435 depth camera
- Livox Mid-360 3D LiDAR
- 360° depth perception through integration of 3D LiDAR and depth camera system

### Unitree G1

#### Physical Specifications
- **Height:** 1.32 meters
- **Weight:** 35 kg
- **Degrees of Freedom:**
  - Base model: 23 DOF (6 per leg, 5 per arm, plus waist)
  - EDU Ultimate: Up to 43 DOF total

#### Actuator System
**Motor Type:** Proprietary low-inertia Permanent Magnet Synchronous Motor (PMSM)

**Features:**
- Hollow shafts for reduced weight
- Fast response and efficient heat dissipation
- Low-latency response
- Compact planetary gearboxes
- Backdrivability
- Thermal monitoring
- Industrial-grade crossed roller bearings
- Dual encoders with 500 Hz control loop

**Torque Capabilities:**
- Maximum torque: Up to 120 N·m (EDU) or 90 N·m (Basic)
- Knee actuators: Up to 120 N·m

#### Computing & Sensors
**Computing:**
- 8-core high-performance CPU for real-time control
- NVIDIA Jetson Orin module (100 TOPS AI computing) in EDU Ultimate

**Sensors:**
- 3D LiDAR
- Depth cameras
- IMU
- Joint sensors/encoders
- Optional AI camera modules

#### Performance
- **Battery:** 9000 mAh lithium-ion
- **Runtime:** Up to 2 hours continuous operation
- **Speed:** Up to ~2 m/s
- **Connectivity:** Wi-Fi 6 and Bluetooth 5.2 built-in

---

## Sanctuary AI Phoenix

### Overview
Custom-designed humanoid robot with industry-leading dexterous human-like hands and innovative hydraulic actuation system.

### Design Philosophy
- Everything custom designed and built at Sanctuary
- All components proprietary
- Focus on hydraulic miniaturization

### Hydraulic Actuation System

#### Miniaturization Achievements
- Actuators and valve systems reduced to coin-sized dimensions
- Tested for over 2 billion cycles without leakage or wear
- Miniaturized hydraulic valves: 50x faster and 6x cheaper than standard options

#### Performance Advantages
- Superior force and velocity compared to electric actuators
- Higher power density than electromechanical actuators
- Millimeter-level finger precision
- Stronger, faster movements

#### Safety Features
- Low-pressure operation (similar to bicycle brakes)
- Food-safe oil
- Safe for human interaction

### Technical Specifications
- **Payload Capacity:** 25 kg
- **Hands:** Industry-leading dexterous human-like design
- **Control:** Multi-jointed limbs with precise hand-eye coordination
- **Environment:** Capable of manipulating objects in delicate environments

### Components (All Proprietary)
- Custom actuators
- Custom sensors
- Custom communications networks
- Custom computer
- Custom physical and mechanical electrical design

### Manufacturing Partnership
**Strategy:** Outsourced manufacturing
- **Partner:** Magna International (contract manufacturer)
- **Philosophy:** Manufacturing should be non-core for robotics startups
- **Approach:** Focus on design; outsource production at scale

---

## 1X Technologies (NEO & EVE)

### Company Background
- Founded in 2014 as Halodi Robotics by Norwegian roboticist Bernt Øivind Børnich
- Rebranded to 1X Technologies in March 2023
- Vision: Humanoids "working at 1x speed" among people
- **Headquarters:** Palo Alto, California
- **Manufacturing:** Hayward, California and Moss, Norway

### Proprietary Technology: Revo1 Actuator

#### Development
- Developed in 2018
- Described as "world's highest torque to weight direct drive servo"
- Tailored explicitly for low gear-ratio robotics

#### Design
- High-torque, low-weight direct-drive actuator
- Inspired by human tendon mechanics
- Low gearing and low friction
- Core component enabling human-like movements

### NEO (Consumer-Ready Humanoid)

#### Actuation Technology
- **System:** Patented "Tendon Drive" system
- **Motors:** Revo1 high torque-density motors
- **Transmission:** Tendon-based transmissions
- **Behavior:** Compliant, quiet movement
- **Safety:** Inherent compliance - yields on contact rather than resists

#### Biomimetic Design
- Tendons mimic biological muscle structure
- Safer human interaction than rigid motor-driven joints
- Unlike industrial robots with rigid motors

#### Physical Specifications
- **Weight:** ~66 lb (≈29.9 kg)
- **Height:** ~5'6"
- **Lifting Capacity:** Up to 154 lb (≈69.9 kg)
- **Carrying Payload:** ~55 lb (≈25 kg)

#### Hand Specifications
- **Dexterity:** "Human-level"
- **Degrees of Freedom:** 22 DOF per hand

#### Performance
- **Walking Speed:** Up to 4 km/h
- **Sprint Speed:** 12 km/h
- **Payload Handling:** Up to 20 kg
- **Noise Level:** ~22 dB (quieter than typical refrigerator)

### EVE (Industrial/Institutional Robot)

#### Design
- Wheeled humanoid robot
- Designed for logistics, security, and healthcare

#### Actuation
- **Type:** Dual robotic arms with Revo1 direct-drive motors
- **Capabilities:** Human-level strength and fine force control
- **Noise:** Minimal noise operation

---

## Apptronik Apollo

### Overview
Designed as the "iPhone of humanoid robots" - modular, versatile general-purpose platform.

### Actuator Development

#### Development History
- Team worked on more than 35 iterations of core actuators
- Company built more than 30 unique electric actuators
- Tested various approaches:
  - Liquid cooling
  - Cable driven
  - Series elastic
  - Parallel elastic
  - Quasi-direct drive

#### Actuator Types
- Combination of linear and rotary actuators
- Advanced electric linear actuators for efficiency
- Reduced mechanical complexity

### Component Efficiency
- New actuators use about 1/3 fewer components than previous versions
- Hit 50% higher speeds than traditional actuators
- Simplified maintenance: Two bolts to swap out an actuator

### Strategic Design Decisions
- Eliminated commercially available rotary joints and motors
- Developed proprietary intellectual property
- Custom actuators throughout

### System Configuration
- Approximately 30 different muscle groups
- Required for basic actions and activities
- Modular design for easy replacement

### Motor Control Technology
**Partnership with Texas Instruments:**
- TI microcontrollers
- Gate drivers
- Analog components
- Precise, safe, power-efficient motor control

---

## Agility Robotics Digit

### Overview
Bipedal robot designed for logistics and warehouse operations, produced at world's first full-scale humanoid robot factory.

### Manufacturing - RoboFab Facility

#### Location
Salem, Oregon

#### Capacity
- Peak production: 10,000 robots per year
- In operation since 2024

#### Production History
- Batch-manufacturing since 2020
- More humanoid robots produced than any other company

#### Assembly Process
**Work Cells for Major Sub-Assemblies:**
- Legs
- Arms
- Torsos
- Actuators

#### Manufacturing Approach
- **CapEx Light:** No heavy machinery or costly industrial equipment
- Focus on efficient assembly rather than heavy manufacturing

### Actuators and Components

#### Joint Design
- Stainless-steel actuators at shoulder and hip joints
- Collections of circuits and sensors in head and torso
- Neatly ordered wire connections

#### Materials
- Aluminum
- Thermoformed polycarbonate variants
- Carbon fiber composite components

### Sensor and Computing Systems

**Sensors:**
- Lidar
- Four Intel RealSense depth cameras
- MEMS IMU
- Absolute and incremental encoders for proprioception

**Computing:**
- Two Intel i7 multi-thread CPUs
- Payload bay for customer-added computers

### Physical Specifications
- **Height:** Approximately 1.7 meters
- **Weight:** 42 kg
- **Payload Capacity:** Up to 16 kg
- **Battery Life:** Up to 4 hours

### Supply Chain Challenges
- Determining actuator quantities needed (10,000 robots/year requires significant actuator supply)
- Sourcing at scale

---

## Fourier Intelligence GR-1 & GR-2

### GR-2 (Next Generation)

#### Actuator System: FSA 2.0
**Technology:** Fourier Smart Actuator 2.0

**Specifications:**
- Seven distinct types of actuators
- Each tailored to specific joint torque demands
- Peak torques exceeding 380 N·m
- Dual-encoder system for doubled control accuracy
- Precise movements in high-pressure environments

#### Physical Specifications
- **Height:** 175 cm (68.9 in)
- **Weight:** 63 kg (139 lb)
- **Degrees of Freedom:** 53 DOF total

#### Hand Design
- 12-DOF dexterous hands
- Six array-type tactile sensors

#### Power System
- Detachable battery
- Twice the capacity of GR-1
- Runtime: Up to 2 hours

#### Performance
- **Single-Arm Load Capacity:** 3 kg (6.6 lb)

### GR-1 (First Generation)

#### Actuator System: FSA (Original)
**Innovation:** Fourier Smart Actuator - all-in-one actuator series

**Specifications:**
- Largest actuators (hips): Up to 300 Nm (221 lb-ft) torque
- Electric actuators throughout

#### Physical Specifications
- **Height:** 165 cm (65 in)
- **Weight:** 55 kg (121 lb)
- **Degrees of Freedom:** 40 DOF total

#### Performance
- **Load Capacity:** Up to 50 kg (110 lb) - nearly its own weight
- **Walking Speed:** Around 5 km/h (3 mph)

---

## UBTECH Walker Series

### Overview
Mass-produced industrial humanoid robots deployed in automotive and electronics manufacturing.

### Actuator Systems

#### Walker S
- **Servo Joints:** 41 with force feedback
- **Force-Compliant Drive Joints:** Newly equipped
- **Rigid-Flexible Coupling:** Hybrid structures

#### Walker (Earlier Model)
- **Actuators:** 36 high-performance actuators

### Sensor Systems
- Multiple visual sensors
- Audio sensors
- Distance sensors
- Multi-modal sensor fusion
- Dynamic environment exploration capabilities

### Technical Details
- Axonometric joint module setups observed at facilities
- Specific gear and internal mechanical component details not publicly disclosed

### Production & Deployment

#### Production Scale
- Production increased mid-November
- First batch delivered to partners
- Plan: 500 units by end of December
- Orders: Surpassed 800 million yuan

#### Major Clients
- BYD
- Geely Auto
- FAW-Volkswagen
- Dongfeng Liuzhou Motor
- Foxconn

#### Deployment
- "World's first mass delivery" of industrial humanoid robots
- Hundreds of Walker S2 units deployed
- Applications: Assembly lines, manufacturing

### Capabilities
- Stable walking on mobile production lines
- Industrial environment operation
- Multi-modal sensing and navigation

---

## Engineered Arts Ameca

### Overview
Advanced humanoid focused on realistic human-robot interaction, facial expressions, and communication.

### Actuator System

#### Degrees of Freedom
- **Total Actuated Movements:** 61
- **Facial Control (Desktop versions):** 27 actuators
- **Neck Control (Desktop versions):** 5 actuators
- **Desktop Total:** 32 actuators

#### Actuation Distribution
- Advanced actuators in face
- Advanced actuators in neck
- Advanced actuators in arms
- Advanced actuators in fingers
- Smooth, precise, lifelike movements

### Power Specifications
- **Input:** 110-240V AC, 50/60Hz, 400W
- **Robot Supply:** 2 × 24V DC, 200W

### Sensors and Input Systems
- Binocular eye cameras
- Chest camera
- Embedded microphones
- Facial recognition sensors
- Comprehensive environmental and user awareness

### Physical Features
- Articulated motorized arms
- Articulated motorized fingers
- Articulated motorized neck
- Articulated motorized facial features
- Lightweight construction for portability and durability
- Grey rubber skin on face and hands

### Software & Operating System

#### Tritium OS
- Custom robot operating system
- Developed by Engineered Arts
- AI and machine learning model integration
- Programming support:
  - Python
  - C++
  - Block-based coding

#### Mesmer Technology
- Enhances realistic expressions
- Enhances realistic movement
- Advanced human-like interaction

### Modularity
- Hardware upgradeable
- Software upgradeable
- Independent component operation possible (arm, head, etc.)
- Designed for flexibility and future enhancements

---

## Xiaomi CyberOne

### Overview
High-performance humanoid robot developed by Xiaomi with custom motors and sensors.

### Actuator System

#### Motor Development
**High-Efficiency Upper Limb Motor:**
- Weight: Only 500g
- Rated Output Torque: Up to 30 Nm
- Power Density: 96 Nm/kg through precision manufacturing

**Hip Joint Motor:**
- Instantaneous Peak Torque: Up to 300 Nm

**Motor Technology:**
- Frameless torque motors in joint units
- Custom-developed joint motors
- Designed specifically for CyberOne

### Degrees of Freedom
- **Joints:** 13 different joints
- **Total DOF:** 21 degrees of freedom
- Enables posture maintenance and balance during bipedal locomotion

### Sensor Systems

**Vision:**
- Intel RealSense D455 RGB-D camera (head-mounted)
- Mi-Sense depth vision module (self-developed)

**Inertial Measurement:**
- Microstrain 3DM-GX5 IMU (torso)

**Joint Feedback:**
- Rotary encoders in arms and legs
- Custom force/torque sensors

### Computing System
- Dual Intel i7 Xeon quad-core computers
- High-performance processing for control and AI

### Manufacturing Integration
- Xiaomi plans to integrate CyberOne in manufacturing processes
- Designed for eventual industrial application

---

## Clone Robotics (Protoclone & Clone Alpha)

### Company Overview
- **Founded:** 2021 in Poland
- **CEO:** Dhanush Radhakrishnan
- **CTO:** Lukasz Kozlik
- **Approach:** Biomimetic design - replicate human anatomy first, then enable motion

### Revolutionary Technology: Myofiber Artificial Muscles

#### Development
- First invented in 2021
- Described as "only artificial muscle capable of such combination of properties"

#### Characteristics
- Contract using water pressure
- Contract faster than human skeletal muscle fibers
- Unique combination of:
  - Weight
  - Power density
  - Speed
  - Force-to-weight ratio
  - Energy efficiency

### Protoclone

#### Design
- Based on natural human skeleton
- Over 200 degrees of freedom
- Over 1,000 Myofibers for actuation
- 500+ sensors

#### Capabilities
- Mimic lifelike muscles and functions
- Natural human-like movements

### Clone Alpha

#### Skeleton System
- Polymer skeleton with 206 bone analogues
- Replicates human skeletal structure

#### Hydraulic "Vascular System"
- Powered by compact 500-watt pump
- Water-based hydraulic actuation
- Distributes pressure to Myofibers

#### Synthetic Systems
- Skeletal system
- Muscular system (Myofibers)
- Vascular system (hydraulics)
- Nervous system (sensors and control)

#### Availability
- Preorders being accepted
- Consumer/research platform

### Biomimetic Philosophy
Unlike traditional robotics:
- Design movements around anatomy (not structure around movement)
- Replicate biological systems
- Natural motion through artificial muscles
- Human-like form factor and capabilities

---

## AgiBot X1

### Overview
130 cm, 33 kg open-source humanoid platform with 34 DOF, designed for agile movement and development.

### PowerFlow Servo Technology

#### System Overview
- 34 quasi-direct-drive joints
- Powers smooth walking, dynamic balance, upper-body gestures
- Open-source platform

### Actuator Models and Configuration

#### Body Joint Configuration (29 joints total)
- **R86 Motors:** 2 × 9 units
- **R86 Motors:** 3 × 6 units
- **R52 Motors:** 10 units
- **L28 Motors:** 4 units
- **Grippers:** 2 units

#### Head Expansion (Optional)
- Additional 3 degrees of freedom

### Flagship R86-3 Actuator Specifications

**Physical:**
- Product Weight: 1.28 kg
- Product Size: Φ86 × 80.7 mm

**Performance:**
- Peak Torque: 200 N·m
- Peak Speed: 85 rpm
- Rated Voltage: 48V

### PowerFlow Joint Motor Technology

#### Design Features
- Quasi-direct drive joint solution
- Low cogging torque design
- High-torque pellucidity planetary reducers
- Gear ratio within 10:1
- Coaxial dual encoders
- Liquid cooling circulation system

### Control System
- Default mode: Mode 6 (MIT hybrid control)
- Documented in PowerFlow R series actuator product manual
- Open-source development platform

### Performance
- **Walking Speed:** 3.6 km/h
- **Arm Payload:** 0.5 kg
- **Platform:** Open-source for research and development

---

## PAL Robotics TALOS

### Overview
High-performance, fully electrical humanoid research platform targeted for industrial applications.

### Physical Specifications
- **Height:** 1.75 meters
- **Weight:** 100 kg
- **Power:** Fully electrical

### Actuator Architecture

#### Motor and Transmission System
- **Motors:** Brushless motors
- **Gearing:** Connected to Harmonic Drives
- **Feedback:** Harmonic Drives connected to torque sensors
- **Control:** Torque sensor feedback in all joints

### Degrees of Freedom (32 Total)
- **Legs:** 6-DOF each
- **Arms:** 7-DOF each
- **Hands:** 1-DOF each
- **Neck:** 2-DOF
- **Waist:** 2-DOF

### Control System

#### Communication
- Full EtherCAT communications
- Internal networks run control loops in kilohertz range
- High-frequency control for precision

#### Motion Control
- Torque control to move limbs
- Real-time feedback
- Precise force application

### Performance Capabilities

#### Arm Strength
- Each 7-DOF arm can lift 6 kg at full extension
- Precision manipulation

#### Mobility
- Walking Speed: 3 km/h
- Stable bipedal locomotion

#### Power Delivery
- Batteries deliver peaks of 150 A for powerful motions
- High current capacity for dynamic movements

### Research Platform
- Designed for industrial applications research
- Full technical specifications available in PAL Robotics datasheet
- Research papers published (IROS 2017)

---

## Understanding Humanoid Robot Gearing Systems

### Overview of Gear Types

Humanoid robots require specialized gearing systems to achieve:
- High precision
- Minimal backlash
- High torque in compact size
- Lightweight design
- Smooth operation

### Primary Gear Technologies

#### 1. Harmonic Drives (Strain Wave Gears)

**Manufacturer:** Harmonic Drive (original), now produced by multiple manufacturers

**Components:**
1. **Circular Spline** (outer ring with internal teeth)
2. **Flexible Spline** (thin-walled cup with external teeth)
3. **Wave Generator** (elliptical plug with bearing)

**Operating Principle:**
- Wave generator deforms flexible spline into elliptical shape
- Flexible spline engages with circular spline at major axis
- Rotation of wave generator creates smooth motion
- High reduction ratio from small difference in tooth count

**Advantages:**
- High precision with minimal backlash
- High transmission ratio
- Small size and lightweight
- Ideal for applications requiring exact positioning
- High torque capacity
- Increased precision and repeatability
- No backlash when properly manufactured

**Applications in Humanoid Robots:**
- Tesla Optimus: 28 actuators include 14 rotary actuators, each with harmonic gear drive
- PAL Robotics TALOS: Harmonic Drives in all joints
- Most common choice for humanoid robots due to precision requirements

**Disadvantages:**
- More expensive than planetary gears
- Requires precise manufacturing
- Flexible spline subject to fatigue over time

#### 2. Planetary Gears

**Components:**
1. **Sun Gear** (central gear)
2. **Planet Gears** (multiple gears orbiting sun)
3. **Ring Gear** (outer gear with internal teeth)
4. **Carrier** (holds planet gears)

**Operating Principle:**
- Sun gear drives planet gears
- Planet gears rotate around sun while orbiting
- Ring gear provides reaction or additional output
- Multiple contact points distribute load

**Advantages:**
- Compact design
- High torque capacity
- Load distribution across multiple planet gears
- Relatively simple and robust
- Cost-effective
- Good power density

**Applications in Humanoid Robots:**
- Unitree G1: Compact planetary gearboxes in actuators
- AgiBot X1: High-torque pellucidity planetary reducers within 10 gear ratio
- Often used in combination with other technologies

**Disadvantages:**
- More backlash than harmonic drives
- Lower precision than strain wave gears
- More components = more potential failure points

#### 3. RV Gears (Rotary Vector Reducers)

**Components:**
- Cycloid disc mechanism
- Complex multi-stage reduction

**Advantages:**
- Extremely high torque capacity
- Very high reduction ratios
- Excellent shock load resistance
- High rigidity

**Applications:**
- More common in industrial robot arms
- Less common in humanoid robots due to weight

**Disadvantages:**
- Heavier than harmonic drives
- More complex
- Higher cost

#### 4. Cycloidal Drives

**Operating Principle:**
- Eccentric input drives cycloidal disc
- Disc engages with ring gear pins
- Small difference in teeth creates high reduction

**Advantages:**
- High reduction ratios
- Compact
- High shock load capacity

**Disadvantages:**
- Complex manufacturing
- Can have higher friction
- Less common in humanoid applications

### Gear Selection Criteria for Humanoid Robots

#### For Arms and Hands:
- **Preferred:** Harmonic drives
- **Reason:** High precision needed for manipulation
- **Alternative:** Planetary gears for less critical joints

#### For Legs (Hip/Knee):
- **Preferred:** Harmonic drives or high-torque planetary
- **Reason:** High torque requirements with precision for balance
- **Examples:**
  - Tesla Optimus: Harmonic reducers
  - Unitree: Planetary gearboxes

#### For Waist/Torso:
- **Preferred:** Harmonic drives
- **Reason:** Precision for balance and coordination
- **Alternative:** Planetary for cost reduction

### Quasi-Direct Drive Approach

**Used By:** AgiBot X1, some research platforms

**Concept:**
- Low gear ratios (typically <10:1)
- Relies on high-torque motors
- Reduces mechanical complexity
- Improves backdrivability
- Better force sensing

**Advantages:**
- Increased responsiveness
- Better compliance for safe human interaction
- Simplified mechanical design
- Improved force control

**Disadvantages:**
- Requires specialized high-torque motors
- May have lower peak torque
- More expensive motors

### Direct Drive (No Gears)

**Used By:** 1X Technologies (Revo1), some research platforms

**Concept:**
- No gearing between motor and output
- Motor directly drives joint

**Advantages:**
- No backlash
- Maximum backdrivability
- Simplified mechanical design
- Excellent force control
- No gear wear

**Disadvantages:**
- Requires very high-torque motors
- Motors are large and heavy
- Lower reduction means lower output torque
- Higher cost

### Tendon/Cable Drive Systems

**Used By:** 1X Technologies NEO, some research platforms

**Concept:**
- Motors located remotely (e.g., in torso)
- Cables/tendons transmit force to joints
- Similar to biological muscle-tendon systems

**Advantages:**
- Reduces weight at extremities
- Inherent compliance (safety)
- Biomimetic design
- Quieter operation

**Disadvantages:**
- Cable stretch and wear
- More complex routing
- Friction losses
- Requires tensioning systems

### Manufacturing Considerations

#### Precision Requirements:
- Humanoid robots require precision positioning
- Typical backlash requirements: <1 arcminute
- Manufacturing tolerances critical for performance

#### Heat Dissipation:
- High-torque operations generate heat
- Cooling systems important:
  - Liquid cooling (AgiBot X1)
  - Thermal monitoring (Unitree G1)
  - Heat dissipation design

#### Maintenance:
- Gear wear over time
- Regular lubrication required
- Harmonic drive flexible spline fatigue
- Service life considerations in design

### Emerging Trends

#### 1. Integrated Actuators
- Motor, gear, sensor, and driver in single unit
- Simplifies assembly
- Reduces wiring
- Examples: Most modern humanoid platforms

#### 2. High-Integration Designs
- Coaxial dual encoders (AgiBot X1)
- Integrated force/torque sensing
- Built-in thermal management
- Compact packaging

#### 3. Custom Designs
- Companies developing proprietary gearing
- Optimized for specific applications
- Examples: Sanctuary AI miniaturized hydraulics, 1X Revo1

---

## Production and Manufacturing Insights

### High-Volume Manufacturing Facilities

#### Agility Robotics - RoboFab
- **Location:** Salem, Oregon
- **Capacity:** 10,000 robots/year at peak
- **Approach:** CapEx light - no heavy machinery
- **Focus:** Assembly rather than part manufacturing
- **Unique Feature:** First full-scale humanoid robot factory

#### Figure AI - BotQ
- **Capacity:** 12,000 humanoids/year (first generation line)
- **Strategy:** In-house assembly of core tech, outsource piece parts
- **Challenge:** Building supply chain from scratch

### Contract Manufacturing

#### Sanctuary AI + Magna International
- **Philosophy:** Manufacturing should be non-core for robotics startups
- **Approach:** Design in-house, production outsourced
- **Advantage:** Leverages established manufacturing expertise
- **Scale:** High-volume production capability

### In-House Manufacturing

#### Tesla
- **Approach:** Vertical integration
- **Timeline:** Low production 2025 (internal), broader 2026
- **Advantage:** Control over proprietary technology
- **Scale:** Leveraging automotive manufacturing expertise

#### 1X Technologies
- **Locations:** Hayward, CA and Moss, Norway
- **Approach:** Hybrid - multiple facilities
- **Focus:** Proprietary Revo1 technology

### Supply Chain Challenges

#### Common Issues:
1. **Actuator Supply:** Scaling to thousands of units requires massive actuator production
2. **Component Sourcing:** Expensive specialized components (motors, sensors)
3. **Mature Supply Chain:** Lack of established suppliers for humanoid-specific parts
4. **Part Manufacturing:** Determining in-house vs. outsource for each component
5. **Quality Control:** Maintaining precision across large production runs

### Component Manufacturing Approaches

#### In-House Core Technology:
- Actuators (proprietary designs)
- Hands (high-value, difficult)
- Batteries (custom integration)
- Final assembly

#### Outsourced Components:
- Piece parts
- Standard sensors
- Computing hardware
- Structural components

### Material Selection

#### Common Materials:
- **Aluminum:** Lightweight structural components
- **Carbon Fiber:** High-strength, low-weight parts
- **Titanium:** High-stress joints and actuators
- **3D Printed Parts:** Custom geometries, rapid iteration
- **Polycarbonate:** Covers and non-structural elements

### Testing and Quality Control

#### Testing Requirements:
- **Actuator Testing:** Billions of cycles (Sanctuary AI: 2 billion without failure)
- **System Integration:** Full robot testing before deployment
- **Performance Validation:** Speed, torque, precision measurements
- **Reliability Testing:** Long-duration operation tests

### Production Economics

#### Cost Drivers:
1. **Actuators:** Most expensive components
2. **Sensors:** LiDAR, cameras, force sensors
3. **Computing:** High-performance processors
4. **Batteries:** Custom power systems
5. **Assembly:** Labor-intensive integration

#### Cost Reduction Strategies:
1. **Component Reduction:** Apptronik reduced components by 1/3
2. **Manufacturing Innovation:** Sanctuary AI valves 6x cheaper
3. **Standardization:** Modular designs for easier assembly
4. **Automation:** Using robots to build robots
5. **Scale:** Volume production driving down per-unit costs

### Quality Considerations

#### Critical Quality Factors:
- **Precision:** Gear manufacturing tolerances
- **Consistency:** Actuator performance matching
- **Reliability:** Component longevity
- **Safety:** Force limiting, emergency stops
- **Durability:** Operating life requirements

### Future Manufacturing Trends

1. **Increased Automation:** Robots building robots
2. **Supply Chain Maturation:** More specialized suppliers
3. **Standardization:** Common actuator interfaces
4. **Modular Design:** Easier assembly and maintenance
5. **Regional Production:** Local manufacturing for key markets
6. **Vertical Integration:** More in-house component production
7. **Advanced Materials:** New lightweight, strong materials

---

## Conclusion

This documentation provides comprehensive technical information about the major humanoid robots in development and production as of 2025. Key trends include:

1. **Actuator Technology:** Shift toward custom, integrated actuators with harmonic or planetary gearing
2. **Manufacturing Scale:** First high-volume production facilities coming online
3. **Design Philosophy:** Mix of biomimetic and engineering-optimized approaches
4. **Power Systems:** Predominantly electric, with some hydraulic innovations
5. **Gearing:** Harmonic drives dominate for precision applications
6. **Production:** Mix of in-house and outsourced manufacturing strategies

The humanoid robotics industry is rapidly maturing, with significant advances in actuator technology, manufacturing processes, and system integration enabling increasingly capable and cost-effective robots.

---

*Last Updated: 2025*
*Sources: Public technical specifications, company announcements, research papers, and industry reports*
