import React, { useRef, useState, useEffect } from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import request, { gql } from "graphql-request";
import { url } from "../config";

export default function Tags({ values, setFieldValue, name, touched, error }) {
	const [tags, setTags] = useState([]);
	const [value, setValue] = useState("");
	const [categories, setCategories] = useState([]);
	const tagInput = useRef();
	useEffect(async () => {
		const query = gql`
			query Query {
				getCategories {
					name
					description
				}
			}
		`;
		const { getCategories } = await request(url, query, {});
		const others = [
			{ name: "others", description: "products without a provided category" },
		];
		setCategories(getCategories.concat(others));
	}, []);
	const handleDelete = (tag) => {
		const newTag = values[name].filter((t) => t !== tag);
		setTags(newTag);
		setFieldValue(`${name}`, newTag);
	};
	const handleSubmit = (e) => {
		if (e.key == "Enter") {
			e.preventDefault();
			const find = categories.find((cat) => cat.name === value);
			let category = "others";
			if (find || (find && !find.name === "others")) category = find.name;

			const isUsed = values[name].find((e) => e === category);
			if (!isUsed) setFieldValue(`${name}`, [...values[name], category]);
			setValue("");
		}
	};
	return (
		<div>
			{values[name] &&
				values[name].map((tag) => (
					<span>
						{tag}
						<button onClick={() => handleDelete(tag)} type="button">
							x
						</button>
					</span>
				))}
			<input
				ref={tagInput}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyPress={(e) => handleSubmit(e)}
				type="input"
				list="tag-options"
			/>
			<datalist id="tag-options">
				{categories.length > 0
					? categories.map((category) => <option value={category.name} />)
					: null}
			</datalist>
			{error && touched ? (
				<p className="message-error">
					<p>feel free to use others if there isn't an avaliable second tag</p>
					<FontAwesomeIcon
						style={{ marginRight: 5 }}
						icon={faExclamationCircle}
					/>
					{error}
				</p>
			) : null}
		</div>
	);
}
