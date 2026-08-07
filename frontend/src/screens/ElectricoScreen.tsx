import { SensorTile } from "../components/ha/SensorTile.js";
import { ToggleTile } from "../components/ha/ToggleTile.js";
import { HaStatusBadge } from "../components/ha/HaStatusBadge.js";

function SensorRow({ ids }: { ids: string[] }): React.ReactNode {
  return (
    <div className="sensor-grid">
      {ids.map((id) => (
        <SensorTile key={id} entityId={id} />
      ))}
    </div>
  );
}

export function ElectricoScreen(): React.ReactNode {
  return (
    <div className="ha-screen">
      <div className="ha-screen__head">
        <h2 className="ha-screen__title">Eléctrico</h2>
        <HaStatusBadge />
      </div>

      <section className="panel">
        <h3 className="panel__title">Consumo Sonoff Planta Baja</h3>
        <SensorRow
          ids={[
            "sensor.sonoff_1001d4e658_power",
            "sensor.sonoff_1001d4e658_voltage",
            "sensor.sonoff_1001d4e658_energy_day",
            "sensor.sonoff_1001d4e658_energy_month",
          ]}
        />
      </section>

      <section className="panel">
        <h3 className="panel__title">Consumo Sonoff Planta Alta</h3>
        <SensorRow
          ids={[
            "sensor.sonoff_1001db2d0b_power",
            "sensor.sonoff_1001db2d0b_voltage",
            "sensor.sonoff_1001db2d0b_energy_day",
            "sensor.sonoff_1001db2d0b_energy_month",
          ]}
        />
      </section>

      <section className="panel">
        <h3 className="panel__title">Aire acondicionado (energía)</h3>
        <SensorRow
          ids={[
            "sensor.entretenimiento_aire_acondicionado_energy_today",
            "sensor.aire_acondicionado_energy_yesterday",
            "sensor.aire_acondicionado_energy_this_month",
            "sensor.aire_acondicionado_energy_last_month",
          ]}
        />
      </section>

      <section className="panel">
        <h3 className="panel__title">Cafetera</h3>
        <div className="sensor-grid">
          <SensorTile entityId="sensor.toma_cafetera_power" />
          <SensorTile entityId="sensor.toma_cafetera_energy" />
        </div>
        <div className="ha-grid ha-grid--single">
          <ToggleTile entityId="switch.toma_cafetera" />
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__title">Ambientes (temperatura y humedad)</h3>
        <SensorRow
          ids={[
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
          ]}
        />
      </section>

      <section className="panel">
        <h3 className="panel__title">Homelab — Proxmox</h3>
        <SensorRow
          ids={[
            "binary_sensor.node_homelab_status",
            "binary_sensor.node_homelab_updates_packages",
            "binary_sensor.qemu_harbor_101_status",
            "binary_sensor.qemu_homeassistan_102_status",
            "binary_sensor.qemu_k3s_master_1_106_status",
            "binary_sensor.qemu_k3s_worker_1_107_status",
            "binary_sensor.qemu_k3s_worker_2_108_status",
            "binary_sensor.lxc_hb_pi_hole_100_status",
            "binary_sensor.lxc_unifi_103_status",
            "binary_sensor.lxc_nginxproxymanager_104_status",
          ]}
        />
      </section>

      <section className="panel">
        <h3 className="panel__title">Homelab — Discos y temperatura</h3>
        <SensorRow
          ids={[
            "sensor.central_dogma_temperature",
            "sensor.terminal_dogma_terminal_dogma_cpu_temperature",
            "binary_sensor.disk_homelab_samsung_mzvlb512hajq_000l7_health",
            "sensor.disk_homelab_samsung_mzvlb512hajq_000l7_temperature",
            "binary_sensor.disk_homelab_wd_green_2_5_1000gb_health",
            "sensor.disk_homelab_wd_green_2_5_1000gb_temperature",
          ]}
        />
      </section>

      <section className="panel">
        <h3 className="panel__title">Impresora K1Max</h3>
        <SensorRow
          ids={[
            "sensor.k1max_a01c_bed_temperature",
            "sensor.k1max_a01c_extruder_temperature",
          ]}
        />
      </section>
    </div>
  );
}
