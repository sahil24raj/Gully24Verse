import { PlayerControlsInput, VehicleConfig, VehiclePhysicsState } from './types';

export class VehicleController {
  public config: VehicleConfig;
  public state: VehiclePhysicsState;

  // Physical parameters (Calibrated for high-speed continuous arcade racing)
  private maxForwardSpeedMs = 32; // Base top speed ~115 km/h
  private maxReverseSpeedMs = 9;  // ~32 km/h
  private accelerationMs2 = 18;   // Punchy base accel
  private brakingMs2 = 28;        // Responsive brakes
  private dragCoefficient = 0.009;// Aerodynamic drag (smooth airflow, doesn't kill speed)
  private rollingFriction = 0.025;// Smooth asphalt rolling resistance
  private maxSteerAngle = 0.40;   // ~23 degrees

  // Progressive momentum buildup: as you drive uninterrupted, speed builds like real vehicles
  public continuousDriveTime = 0;
  public momentumLevel = 1.0;

  constructor(config: VehicleConfig, startX = 0, startZ = 0, startYaw = 0) {
    this.config = config;

    // Apply vehicle stats + upgrades
    const speedBonus = 1 + (config.stats.topSpeed - 68) * 0.015 + config.upgrades.topSpeed * 0.05;
    const accelBonus = 1 + (config.stats.accel - 65) * 0.015 + config.upgrades.accel * 0.06;
    const handlingBonus = 1 + (config.stats.handling - 70) * 0.012 + config.upgrades.handling * 0.05;

    this.maxForwardSpeedMs = (config.stats.topSpeed / 2.3) * speedBonus;
    this.accelerationMs2 = 16 * accelBonus;
    this.maxSteerAngle = 0.40 * handlingBonus;

    this.state = {
      x: startX,
      y: 0,
      z: startZ,
      vx: 0,
      vy: 0,
      vz: 0,
      yaw: startYaw,
      pitch: 0,
      roll: 0,
      steeringAngle: 0,
      speedKmh: 0,
      rpm: 1000,
      gear: 1,
      isGrounded: true,
      isDrifting: false,
      driftFactor: 0,
      isNitroActive: false,
      nitroRemaining: 100,
      lap: 1,
      currentCheckpoint: 0,
      raceDistanceTraveled: 0,
      lapTimes: [],
      currentLapTime: 0,
      bestLapTime: 0,
      isFinished: false,
      finishPosition: 0
    };
  }

  public update(delta: number, input: PlayerControlsInput): void {
    if (this.state.isFinished) {
      // Gentle coast to stop
      this.state.vx *= 0.94;
      this.state.vz *= 0.94;
      this.updateSpeedAndEngine();
      return;
    }

    this.state.currentLapTime += delta;

    // 1. Nitro Handling
    if (input.nitro && this.state.nitroRemaining > 0 && input.throttle > 0) {
      this.state.isNitroActive = true;
      this.state.nitroRemaining = Math.max(0, this.state.nitroRemaining - delta * 22);
    } else {
      this.state.isNitroActive = false;
      // Passive recharge
      if (!input.nitro) {
        this.state.nitroRemaining = Math.min(100, this.state.nitroRemaining + delta * 7);
      }
    }

    // 2. Current velocity along forward heading
    const forwardX = Math.sin(this.state.yaw);
    const forwardZ = Math.cos(this.state.yaw);
    const rightX = Math.cos(this.state.yaw);
    const rightZ = -Math.sin(this.state.yaw);

    const currentForwardSpeed = this.state.vx * forwardX + this.state.vz * forwardZ;
    const currentLateralSpeed = this.state.vx * rightX + this.state.vz * rightZ;

    // Progressive Momentum Buildup: "jaise jaise aage chale bina ruke speed badhe"
    if (currentForwardSpeed > 3 && input.throttle > 0 && !input.brake) {
      this.continuousDriveTime += delta;
      // Smoothly builds momentum up to +28% speed bonus as you drive uninterrupted
      this.momentumLevel = Math.min(1.28, 1.0 + (this.continuousDriveTime / 16) * 0.28);
    } else if (input.brake > 0 || currentForwardSpeed < 2) {
      this.continuousDriveTime = Math.max(0, this.continuousDriveTime - delta * 3);
      this.momentumLevel = Math.max(1.0, 1.0 + (this.continuousDriveTime / 16) * 0.28);
    }

    const nitroMultiplier = this.state.isNitroActive ? (this.config.stats.nitroPower * 1.35) : 1.0;
    const effectiveMaxSpeed = this.maxForwardSpeedMs * (this.state.isNitroActive ? 1.30 : 1.0) * this.momentumLevel;

    // 3. Steering Angle calculation (Speed-sensitive steering)
    const speedRatio = Math.min(1, Math.abs(currentForwardSpeed) / this.maxForwardSpeedMs);
    const effectiveMaxSteer = this.maxSteerAngle * (1 - speedRatio * 0.38);
    const targetSteer = -input.steer * effectiveMaxSteer;
    this.state.steeringAngle += (targetSteer - this.state.steeringAngle) * Math.min(1, delta * 12);

    // 4. Drift Mechanics
    const isDriftingInitiated = input.drift && Math.abs(currentForwardSpeed) > 7 && Math.abs(input.steer) > 0.2;
    if (isDriftingInitiated) {
      this.state.isDrifting = true;
      this.state.driftFactor = Math.min(1.0, this.state.driftFactor + delta * 2.5);
    } else {
      this.state.isDrifting = false;
      this.state.driftFactor = Math.max(0, this.state.driftFactor - delta * 3.0);
    }

    // 5. Yaw Rotation (Turn rate)
    const turnGrip = this.state.isDrifting ? 1.45 : 1.0;
    const turnDirection = currentForwardSpeed >= -0.5 ? 1 : -1;
    const yawRate = (currentForwardSpeed / 2.4) * Math.tan(this.state.steeringAngle) * turnGrip * turnDirection;
    this.state.yaw += yawRate * delta;

    // 6. Progressive Acceleration and Braking Forces (Realistic power curves without sudden stalls)
    let forwardForce = 0;

    if (input.throttle > 0) {
      const currentRatio = Math.max(0, currentForwardSpeed / effectiveMaxSpeed);

      // Gear-based progressive engine torque curve
      let gearTorque = 1.0;
      if (currentRatio < 0.25) {
        // 1st gear launch punch: quick pickup from standstill
        gearTorque = 1.5 - currentRatio * 1.2;
      } else if (currentRatio < 0.65) {
        // 2nd / 3rd gear strong acceleration
        gearTorque = 1.25 - (currentRatio - 0.25) * 0.45;
      } else {
        // 4th / 5th gear sustained top-end pull (smooth asymptotic taper, no hard wall)
        gearTorque = Math.max(0.12, 1 - Math.pow(currentRatio, 1.6));
      }

      forwardForce += this.accelerationMs2 * input.throttle * gearTorque * nitroMultiplier;
    }

    if (input.brake > 0) {
      if (currentForwardSpeed > 0.8) {
        // Active Braking
        forwardForce -= this.brakingMs2 * input.brake;
      } else {
        // Reverse Gear
        if (currentForwardSpeed > -this.maxReverseSpeedMs) {
          forwardForce -= this.accelerationMs2 * 0.65 * input.brake;
        }
      }
    }

    // Passive Deceleration & Rolling Resistance (Tuned for momentum preservation)
    forwardForce -= currentForwardSpeed * this.dragCoefficient * Math.abs(currentForwardSpeed);
    forwardForce -= currentForwardSpeed * this.rollingFriction * 9.8;

    // Lateral Tire Grip & Slip
    const lateralGripFactor = this.state.isDrifting ? 0.35 : 0.92;
    const correctedLateralSpeed = currentLateralSpeed * (1 - lateralGripFactor * Math.min(1, delta * 15));

    // Reconstruct velocity with forward kinetic energy preservation through curves
    const newForwardSpeed = currentForwardSpeed + forwardForce * delta;
    const currentTotalSpeed = Math.sqrt(this.state.vx * this.state.vx + this.state.vz * this.state.vz);
    const speedRetention = this.state.isDrifting ? 0.985 : 0.997;
    const targetForwardSpeed = Math.max(newForwardSpeed, currentTotalSpeed * speedRetention);

    this.state.vx = forwardX * targetForwardSpeed + rightX * correctedLateralSpeed;
    this.state.vz = forwardZ * targetForwardSpeed + rightZ * correctedLateralSpeed;

    // 7. Update World Positions
    this.state.x += this.state.vx * delta;
    this.state.z += this.state.vz * delta;

    // 8. Auto-Rickshaw Body Roll & Pitch (The iconic Rickshaw tilt!)
    const rollTarget = (currentLateralSpeed / 12) * 0.18 + (this.state.isDrifting ? (input.steer > 0 ? 0.06 : -0.06) : 0);
    this.state.roll += (rollTarget - this.state.roll) * Math.min(1, delta * 8);

    const pitchTarget = (forwardForce / 25) * 0.05;
    this.state.pitch += (pitchTarget - this.state.pitch) * Math.min(1, delta * 10);

    // 9. Update Speed & Engine Audio State
    this.updateSpeedAndEngine();
  }

  private updateSpeedAndEngine(): void {
    const speedMs = Math.sqrt(this.state.vx * this.state.vx + this.state.vz * this.state.vz);
    this.state.speedKmh = Math.round(speedMs * 3.6);

    // 5-Gear & RPM Calculation for realistic high-speed Indian auto racing
    const kmh = this.state.speedKmh;
    if (kmh < 25) {
      this.state.gear = 1;
      this.state.rpm = 1100 + (kmh / 25) * 3600;
    } else if (kmh < 55) {
      this.state.gear = 2;
      this.state.rpm = 2400 + ((kmh - 25) / 30) * 3800;
    } else if (kmh < 90) {
      this.state.gear = 3;
      this.state.rpm = 2800 + ((kmh - 55) / 35) * 4000;
    } else if (kmh < 130) {
      this.state.gear = 4;
      this.state.rpm = 3200 + ((kmh - 90) / 40) * 4200;
    } else {
      this.state.gear = 5;
      this.state.rpm = 3600 + Math.min(2400, ((kmh - 130) / 45) * 2400);
    }
  }

  public resetTo(x: number, z: number, yaw: number): void {
    this.state.x = x;
    this.state.y = 0;
    this.state.z = z;
    this.state.vx = 0;
    this.state.vy = 0;
    this.state.vz = 0;
    this.state.yaw = yaw;
    this.state.pitch = 0;
    this.state.roll = 0;
    this.state.steeringAngle = 0;
    this.state.speedKmh = 0;
    this.state.isDrifting = false;
    this.state.isNitroActive = false;
  }
}

