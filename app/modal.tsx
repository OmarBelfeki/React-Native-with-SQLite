import {StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput} from "react-native";
import {Stack, router, useLocalSearchParams} from "expo-router"
import {useEffect, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";


export default function Modal() {
	const {id} = useLocalSearchParams();
	const [name, set_name] = useState("");
	const [email, set_email] = useState("");
	const [edit_mode, set_edit_mode] = useState(false);

	const database = useSQLiteContext();

	useEffect(() => {
		if(id){
			set_edit_mode(true)
			loadData()
		}
	}, [id])

	const loadData = async () => {
		const result = await database.getFirstAsync<{name: string, email: string}>(
			"select name, email from users where id=?;",
			[parseInt(id as string)]
		)
		set_name(result.name);
		set_email(result.email);
	}

	const handle_save = async () => {
		try {
			await database.runAsync("INSERT INTO users (name, email) VALUES (?, ?);", [name, email])
			router.back();
		}catch (error) {
			console.error(error);
		}finally {
			set_email("")
			set_name("")
		}
	}

	const handle_update = async () => {
		try{
			const response = await database.runAsync(
				"update users set name=?, email=? where id=?",
				[name, email, parseInt(id as string)]
			);
			console.log("Item update successfully: ", response?.changes);
			router.back();
		}catch (e) {
			console.error("Error updating item: ", e)
		}finally {
			set_email("")
			set_name("")
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen options={{title: "Item Model"}} />
			<View style={{flex: 1, flexDirection: "column", gap: 20, marginVertical: 20}}>
				<TextInput
					placeholder="Name"
					value={name}
					onChangeText={(text) => set_name(text)}
					style={styles.text_input}
				/>
				<TextInput
					placeholder="Email"
					value={email}
					keyboardType="email-address"
					onChangeText={(text) => set_email(text)}
					style={styles.text_input}
				/>
			</View>
			<View style={{flex: 1, flexDirection: "row", gap: 20}}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={[styles.button, {backgroundColor: "red"}]}
				>
					<Text style={styles.buttonText}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={async () => {edit_mode ? await handle_update() : await handle_save()}}
					style={[styles.button, {backgroundColor: "blue"}]}

				>
					<Text style={styles.buttonText}>{edit_mode ? "Update" : "Save"}</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	text_input: {
		borderWidth: 1,
		width: 300,
		height: 50,
		borderRadius: 10
	},
	button: {
		width: 80,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		color: "white"
	}

})