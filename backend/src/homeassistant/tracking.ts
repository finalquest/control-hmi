export const HA_CONTROL_DOMAINS: readonly string[] = [
  "light",
  "switch",
  "climate",
  "fan",
  "scene",
  "script",
  "input_boolean",
  "input_button",
  "button",
  "input_select",
  "select",
  "number",
  "alarm_control_panel",
  "media_player",
  "cover",
];

export const HA_TRACKED_ENTITIES: readonly string[] = [
  "sensor.sonoff_1001d4e658_power",
  "sensor.sonoff_1001d4e658_voltage",
  "sensor.sonoff_1001d4e658_energy_day",
  "sensor.sonoff_1001d4e658_energy_month",
  "sensor.sonoff_1001db2d0b_power",
  "sensor.sonoff_1001db2d0b_voltage",
  "sensor.sonoff_1001db2d0b_energy_day",
  "sensor.sonoff_1001db2d0b_energy_month",
  "sensor.toma_cafetera_power",
  "sensor.toma_cafetera_voltage",
  "sensor.toma_cafetera_energy",

  "sensor.temperatura_living_temperature",
  "sensor.temperatura_living_humidity",
  "sensor.temperatura_living_battery",
  "sensor.temperatura_entretenimiento_temperature",
  "sensor.temperatura_entretenimiento_humidity",
  "sensor.temperatura_entretenimiento_battery",
  "sensor.temperatura_habitacion_temperature",
  "sensor.temperatura_habitacion_humidity",
  "sensor.temperatura_habitacion_battery",
  "sensor.temperatura_oficina_temperature",
  "sensor.temperatura_oficina_humidity",
  "sensor.temperatura_oficina_battery",

  "binary_sensor.sensor_puertoa_contact",
  "sensor.sensor_puertoa_battery",
  "sensor.sensor_puertoa_voltage",
  "binary_sensor.movimiento_pintuira_occupancy",
  "sensor.movimiento_pintuira_battery",
  "sensor.movimiento_pintuira_illumination",
  "sensor.movimiento_pintuira_voltage",
  "binary_sensor.movimiento_galpon_occupancy",
  "sensor.movimiento_galpon_battery",
  "sensor.movimiento_galpon_illumination",
  "sensor.movimiento_galpon_voltage",

  "binary_sensor.node_homelab_status",
  "binary_sensor.node_homelab_updates_packages",
  "sensor.terminal_dogma_port_9_rx",
  "sensor.terminal_dogma_port_9_tx",
  "sensor.terminal_dogma_cloudflare_wan_latency",
  "sensor.terminal_dogma_google_wan_latency",
  "binary_sensor.qemu_harbor_101_status",
  "binary_sensor.qemu_homeassistan_102_status",
  "binary_sensor.qemu_k3s_master_1_106_status",
  "binary_sensor.qemu_k3s_worker_1_107_status",
  "binary_sensor.qemu_k3s_worker_2_108_status",
  "binary_sensor.lxc_hb_pi_hole_100_status",
  "binary_sensor.lxc_unifi_103_status",
  "binary_sensor.lxc_nginxproxymanager_104_status",
  "sensor.central_dogma_temperature",
  "sensor.terminal_dogma_terminal_dogma_cpu_temperature",

  "sensor.k1max_a01c_bed_temperature",
  "sensor.k1max_a01c_extruder_temperature",

  "sensor.aire_acondicionado_energy_yesterday",
  "sensor.aire_acondicionado_energy_this_month",
  "sensor.aire_acondicionado_energy_last_month",
  "sensor.entretenimiento_aire_acondicionado_energy_today",

  "sensor.iphone_mio_battery_level",

  "binary_sensor.motor_funcionando",

  "sun.sun",
  "sensor.sun_next_rising",
  "sensor.sun_next_setting",
  "zone.home",
];

const TRACKED_SET = new Set(HA_TRACKED_ENTITIES);

export function isTracked(entityId: string): boolean {
  const domain = entityId.split(".")[0];
  return TRACKED_SET.has(entityId) || HA_CONTROL_DOMAINS.includes(domain);
}
