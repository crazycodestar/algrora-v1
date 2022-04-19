import request, { gql } from "graphql-request";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { header } from "../../config";
import { uploadImage as imgUpload } from "../../utilityFunctions";

export default function useImage() {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	const { token } = useSelector((state) => state.accountReducer);

	const uploadImage = async ({ filename, fileType, fileData }) => {
		setLoading(true);
		const query = gql`
			mutation Mutation($filename: String!, $fileType: String!) {
				signS3(filename: $filename, fileType: $fileType)
			}
		`;

		const variables = {
			filename,
			fileType,
		};

		const { signS3 } = await request(
			"graphql",
			query,
			variables,
			header(token)
		);
		if (signS3) {
			try {
				await imgUpload(signS3, fileData);
				return { status: 1, message: signS3.split("?")[0] };
			} catch (err) {
				console.log("image upload failed");
				return {
					status: 0,
					message: "upload failed due to poor connection. try again later",
				};
			}
		}
	};

	return { loading, result, error, uploadImage };
}
