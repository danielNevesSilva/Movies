import { NavigationContainer } from "@react-navigation/native";
import { TabRoutes } from "./tabs.routes";

export function Router(){
    return(
        <NavigationContainer>
            <TabRoutes />
        </NavigationContainer>
    );
}