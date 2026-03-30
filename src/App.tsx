import UpdateBadge from "#/components/UpdateBadge/UpdateBadge";
import { NavBar } from "./components/NavBar/NavBar";
import { InstallBadge } from "./components/InstallBadge/InstallBadge";
import { MessageToastList } from "./components/MessageToast/MessageToastList";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <div className="container">
        <NavBar />
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </main>
      </div>
      <UpdateBadge />
      <InstallBadge />
      <MessageToastList />
    </>
  );
}

export default App;
