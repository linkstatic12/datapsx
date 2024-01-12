import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
  const [mainPage, setMainPage] = React.useState(false);
  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  React.useEffect(() => {
    getActiveRoute(routes);
 
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";

    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) { 
        setCurrentRoute(routes[i].name);
      }
     
    }
    for (let i = 0; i < routes.length; i++) {
      if(window.location.href.indexOf(
        routes[i].layout + "/" + routes[i].path
      ) !== -1 && ((routes[i].layout + "/" +  routes[i].path)=="/admin/default"))
      {
         setMainPage(true)
         break;
        }
      else
         setMainPage(false)
     
    }
    console.log("SDFSD",mainPage)
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    ///admin/default
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
       
        return routes[i].secondary;
      }
     
    }
    console.log("DSFSFD",mainPage)
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="w-full overflow-y-auto">
      {/* <Sidebar open={open} onClose={() => setOpen(false)} /> */}
      {/* Navbar & Main Content */}
      <div className=" w-full bg-lightPrimary dark:!bg-navy-900" >
        {/* Main Content */}
        <main
          className={`mx-[12px] flex-none transition-all md:pr-2`}
        >
          {/* Routes */}
          <div className="overflow-y-auto">
            {console.log(mainPage)}
         { !mainPage  && <Navbar 
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />}
            <div className="pt-5s mx-auto mb-auto overflow-y-auto min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}

                <Route
                  path="/"
                  element={<Navigate to="/admin/data-tables" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
