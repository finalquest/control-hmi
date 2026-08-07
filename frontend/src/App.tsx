import { useState } from "react";
import { NavBar, type ScreenId } from "./components/layout/NavBar.js";
import { HomeScreen } from "./screens/HomeScreen.js";
import { TestScreen } from "./screens/TestScreen.js";
import { AguaScreen } from "./screens/AguaScreen.js";
import { CasaScreen } from "./screens/CasaScreen.js";
import { ConfiguracionScreen } from "./screens/ConfiguracionScreen.js";

export function App(): React.ReactNode {
  const [screen, setScreen] = useState<ScreenId>("home");

  return (
    <div className="app">
      <NavBar current={screen} onSelect={setScreen} />
      <div className="screen">
        {screen === "home" && <HomeScreen />}
        {screen === "test" && <TestScreen />}
        {screen === "agua" && <AguaScreen />}
        {screen === "casa" && <CasaScreen />}
        {screen === "config" && <ConfiguracionScreen />}
      </div>
    </div>
  );
}
