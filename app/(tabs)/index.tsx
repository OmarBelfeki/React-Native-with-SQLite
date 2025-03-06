import {router, Stack, useFocusEffect} from "expo-router";
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {useCallback, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";

type UserType = {id: number, name: string, email: string};

export default function Tab(){
	const [data, set_data] = useState<UserType[]>([]);

	const database = useSQLiteContext();

	const loadData = async () => {
		const result = await database.getAllAsync<UserType>("SELECT * FROM users")
		set_data(result)
	}

	useFocusEffect(
		useCallback(() => {
			loadData()
		}, [])
	)

	const headerRight = () => {
		return (
			<TouchableOpacity
				onPress={() => router.push("/modal")}
				style={{marginRight: 10}}
				activeOpacity={0.7}
			>
				<FontAwesome name={"plus-circle"} size={28} color="blue" />
			</TouchableOpacity>
		)
	}

	const handle_delete = async (id: number) => {
		try{
			const result = await database.runAsync(
				"delete from users where id=?;", [id]
			)
			loadData()
		}catch (e){
			console.error(e)
		}
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{headerRight}} />
			<View>
				<FlatList
					data={data}
					renderItem={({item}) => {
						return (
							<View style={{padding: 10}}>
								<View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
									<View>
										<Text>{item.name}</Text>
										<Text>{item.email}</Text>
									</View>
									<View style={{flexDirection: "row", gap: 10}}>
										<TouchableOpacity
											onPress={() => router.push(`/modal?id=${item.id}`)}
											style={styles.button}
										>
											<Text style={styles.buttonText}>Edit</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => handle_delete(item.id)}
											style={[styles.button, {backgroundColor: "red"}]}
										>
											<Text style={styles.buttonText}>Delete</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						)
					}}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	button: {
		backgroundColor: "blue",
		padding: 5,
		borderRadius: 5,
		height: 30,
		alignItems: "center",
		justifyContent: "center"
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 12
	}
})