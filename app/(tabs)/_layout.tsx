import {FontAwesome} from "@expo/vector-icons";
import {Tabs} from "expo-router";

export default function TabLayout() {
	return (
		<Tabs screenOptions={{tabBarActiveTintColor: "blue"}}>
			<Tabs.Screen
				name={"index"}
				options={{
					title: "Home",
					tabBarIcon: ({color}) => (
						<FontAwesome name="home" color={color} size={28}/>
					)
				}} />
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({color}) => (
						<FontAwesome name="cog" color={color} size={28}/>
					)
				}} />
		</Tabs>
	);
}