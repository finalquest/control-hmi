export interface FanDef {
  fanId: string;
  lightId: string;
  scriptPrefix: string;
}

export interface ClimateDef {
  temp?: string;
  humidity?: string;
  battery?: string;
}

export interface RoomDef {
  id: string;
  name: string;
  zone?: "interior" | "exterior" | "sistemas";
  lights?: string[];
  switches?: string[];
  fan?: FanDef;
  climate?: ClimateDef;
  motion?: string;
  contact?: string;
  illumination?: string;
  scenes?: string[];
}

export const ROOMS: RoomDef[] = [
  {
    id: "exterior",
    name: "Exterior",
    zone: "exterior",
    lights: [
      "light.luz_afuera_izquierda",
      "light.luz_afuera_derecha",
      "light.alero_patio",
      "light.hue_color_spot_1",
      "light.hue_color_spot_2",
    ],
    switches: ["switch.luces_afuera", "switch.luz_escalera"],
    contact: "binary_sensor.sensor_puertoa_contact",
    climate: { battery: "sensor.sensor_puertoa_battery" },
  },
  {
    id: "galpon",
    name: "Galpón",
    zone: "exterior",
    switches: ["switch.luz_galpon"],
    motion: "binary_sensor.movimiento_galpon_occupancy",
    illumination: "sensor.movimiento_galpon_illumination",
    climate: { battery: "sensor.movimiento_galpon_battery" },
  },
  {
    id: "oficina",
    name: "Oficina",
    zone: "interior",
    lights: ["light.luz_ventilador_oficina"],
    fan: {
      fanId: "fan.ventilador_oficina",
      lightId: "input_boolean.fan_oficina_light",
      scriptPrefix: "script.fan_oficina",
    },
    climate: {
      temp: "sensor.temperatura_oficina_temperature",
      humidity: "sensor.temperatura_oficina_humidity",
      battery: "sensor.temperatura_oficina_battery",
    },
  },
  {
    id: "pintura",
    name: "Pintura",
    zone: "interior",
    lights: ["light.luz_ventilador_pintura"],
    fan: {
      fanId: "fan.ventilador_pintura",
      lightId: "input_boolean.fan_pintura_light",
      scriptPrefix: "script.fan_pintura",
    },
    motion: "binary_sensor.movimiento_pintuira_occupancy",
    illumination: "sensor.movimiento_pintuira_illumination",
    climate: { battery: "sensor.movimiento_pintuira_battery" },
  },
  {
    id: "habitacion",
    name: "Habitación",
    zone: "interior",
    lights: ["light.luz_ventilador_habitacion"],
    fan: {
      fanId: "fan.ventilador_habitacion",
      lightId: "input_boolean.fan_habitacion_light",
      scriptPrefix: "script.fan_habitacion",
    },
    climate: {
      temp: "sensor.temperatura_habitacion_temperature",
      humidity: "sensor.temperatura_habitacion_humidity",
      battery: "sensor.temperatura_habitacion_battery",
    },
  },
  {
    id: "living",
    name: "Living",
    zone: "interior",
    lights: ["light.living"],
    climate: {
      temp: "sensor.temperatura_living_temperature",
      humidity: "sensor.temperatura_living_humidity",
      battery: "sensor.temperatura_living_battery",
    },
    scenes: [
      "scene.living_energia",
      "scene.living_concentracion",
      "scene.living_relax",
      "scene.living_lectura",
      "scene.living_atenuado",
      "scene.living_luz_nocturna",
    ],
  },
  {
    id: "cocina",
    name: "Cocina",
    zone: "interior",
    lights: [
      "light.cocina",
      "light.mesada",
      "light.bacha",
      "light.pasa_platos",
      "light.lava_platos",
    ],
    scenes: [
      "scene.cocina_energia",
      "scene.cocina_concentracion",
      "scene.cocina_galaxia",
      "scene.cocina_relax",
      "scene.cocina_lectura",
      "scene.cocina_luz_nocturna",
    ],
  },
  {
    id: "salon",
    name: "Salón / Comedor",
    zone: "interior",
    lights: [
      "light.salon",
      "light.techo",
      "light.techo_2",
      "light.techo_3",
      "light.techo_4",
      "light.techo_5",
      "light.techo_6",
      "light.techo_7",
      "light.techo_8",
      "light.strip",
      "light.ventana_2",
      "light.hue_color_lamp_1",
      "light.sillon",
      "light.sillon_2",
    ],
    scenes: [
      "scene.salon_energia",
      "scene.salon_relax",
      "scene.salon_lectura",
      "scene.salon_luz_nocturna",
      "scene.sillon_energia",
      "scene.sillon_relax",
      "scene.sillon_lectura",
      "scene.sillon_luz_nocturna",
      "scene.comer",
    ],
  },
  {
    id: "entretenimiento",
    name: "Entretenimiento",
    zone: "interior",
    climate: {
      temp: "sensor.temperatura_entretenimiento_temperature",
      humidity: "sensor.temperatura_entretenimiento_humidity",
      battery: "sensor.temperatura_entretenimiento_battery",
    },
  },
];

export const ENERGY_SONOFF = [
  {
    id: "pb",
    name: "Planta Baja",
    switchId: "switch.sonoff_1001d4e658",
    power: "sensor.sonoff_1001d4e658_power",
    voltage: "sensor.sonoff_1001d4e658_voltage",
    energyDay: "sensor.sonoff_1001d4e658_energy_day",
    energyMonth: "sensor.sonoff_1001d4e658_energy_month",
  },
  {
    id: "pa",
    name: "Planta Alta",
    switchId: "switch.sonoff_1001db2d0b",
    power: "sensor.sonoff_1001db2d0b_power",
    voltage: "sensor.sonoff_1001db2d0b_voltage",
    energyDay: "sensor.sonoff_1001db2d0b_energy_day",
    energyMonth: "sensor.sonoff_1001db2d0b_energy_month",
  },
] as const;

export const INFRA = {
  proxmox: [
    "binary_sensor.node_homelab_status",
    "binary_sensor.qemu_harbor_101_status",
    "binary_sensor.qemu_homeassistan_102_status",
    "binary_sensor.qemu_k3s_master_1_106_status",
    "binary_sensor.qemu_k3s_worker_1_107_status",
    "binary_sensor.qemu_k3s_worker_2_108_status",
    "binary_sensor.lxc_hb_pi_hole_100_status",
    "binary_sensor.lxc_unifi_103_status",
    "binary_sensor.lxc_nginxproxymanager_104_status",
  ],
  disks: [
    "binary_sensor.disk_homelab_samsung_mzvlb512hajq_000l7_health",
    "sensor.disk_homelab_samsung_mzvlb512hajq_000l7_temperature",
    "binary_sensor.disk_homelab_wd_green_2_5_1000gb_health",
    "sensor.disk_homelab_wd_green_2_5_1000gb_temperature",
  ],
  temps: [
    "sensor.central_dogma_temperature",
    "sensor.terminal_dogma_terminal_dogma_cpu_temperature",
  ],
  network: [
    "light.geofront_led",
    "light.matsushiro_led",
    "light.matsushiro_led_2",
    "light.neotokyo_2_led",
    "light.tokyo_3_led",
  ],
  control: [
    "switch.control_24v",
    "switch.motor",
    "switch.sonoff_1001d4e658",
    "switch.sonoff_1001db2d0b",
  ],
  k1max: {
    bed: "sensor.k1max_a01c_bed_temperature",
    extruder: "sensor.k1max_a01c_extruder_temperature",
  },
} as const;
