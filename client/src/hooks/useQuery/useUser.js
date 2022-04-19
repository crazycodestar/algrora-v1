import request, { gql } from "graphql-request";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { header } from "../../config";
import useImage from "./useImage";

export default function useUser() {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	const { token } = useSelector((state) => state.accountReducer);

	const { uploadImage } = useImage();

	const updateProfile = async (data) => {
		setLoading(true);
		const { images, username, tel, tags, roomAddress } = data;
		const fileData = images[0];
		let imageUri = null;
		if (fileData && typeof fileData !== "string") {
			console.log("uploading image");
			const result = await uploadImage({
				filename: fileData.name,
				fileType: fileData.type,
				fileData,
			});
			if (!result.status) throw result.message;
			imageUri = result.message;
		}

		const query = gql`
			mutation Mutation($data: UserInput) {
				updateUser(data: $data) {
					status
				}
			}
		`;

		const variables = {
			data: { imageUri, username, tags, tel, roomAddress },
		};
		return console.log(variables);

		const {
			updateUser: { status },
		} = await request("/graphql", query, variables, header(token));
		if (status == "success") {
			console.log("updated");
		}
	};

	return { loading, result, error, updateProfile };
}
