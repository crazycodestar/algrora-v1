const { gql } = require("apollo-server-express");

const typeDefs = gql`
	type User {
		id: ID!
		imageUri: String
		username: String!
		emailAddress: String!
		# password: String!
		cart: [Product]!
		store: String
	}
	type Cart {
		product: Product!
		quantity: Int!
		extraData: [KeyValue]!
	}

	type SubData {
		id: Int!
		key: String
		amount: Int
		value: Int
	}

	type Content {
		info: String!
		status: Int!
		subData: [SubData]
	}

	type Pricing {
		plan: String!
		description: String!
		pricing: Int
		content: [Content]!
	}

	# rating functionality to be resolved
	type Transaction {
		reference: String!
		amount: Int!
		paidAt: String!
		userId: ID!
		storeId: ID!
		plan: Pricing!
		subPlan: SubData
	}
	type RatingDist {
		_5: Int!
		_4: Int!
		_3: Int!
		_2: Int!
		_1: Int!
	}
	type RatingData {
		user: User!
		rating: Int!
	}
	type Rating {
		ratingDistribution: RatingDist
		ratingData: RatingData
	}
	# comment functionality
	type Comment {
		user: User!
		comment: String!
		uploadTime: String!
		likes: Int!
		disLikes: Int!
	}
	type Product {
		id: ID!
		imageUri: String
		name: String!
		description: String!
		price: Int!
		tags: [String]!
		extraData: [KeyValue]!
		store: Store!
		rating: [Rating]!
		comments: [Comment]!
	}

	type Category {
		id: ID!
		name: String!
		description: String
		imageUri: String
		popularity: Int!
	}
	type KeyValue {
		key: String
		values: [String]!
	}
	type Store {
		id: ID!
		name: String!
		imageUri: String
		description: String!
		clientLimit: Int!
		products: [Product]!
		activated: Boolean!
	}
	type Order {
		id: String!
		user: User!
		product: Product!
		quantity: Int!
		store: Store!
		uploadTime: String!
		updatedTime: String!
		lastActive: String!
		read: Boolean!
		meetTime: String
		details: String
		status: String
		message: String
	}
	type StoreMessage {
		status: String!
		message: String
		store: Store
	}
	type UserMessage {
		status: String!
		message: String
		user: User
		isInterest: Boolean
	}
	type ProductMessage {
		status: String!
		message: String
		product: Product
	}
	type CommentMessage {
		status: String!
		message: String
		comment: Comment
	}
	type OrdersMessage {
		status: String!
		message: String
		orders: [Order]
	}
	type ReadMessage {
		status: String!
		message: String
	}
	type IsOrderMessage {
		status: Int!
		message: String
	}
	type PricingMessage {
		plans: String!
		isNew: Boolean
	}
	type OrderMessage {
		status: String!
		unPaid: Int
		orders: [Order!]
	}
	type TransactionMessage {
		status: String!
		message: String
		transactions: [Transaction]
	}
	input UserInput {
		imageUri: String
		username: String
	}
	input ProductInput {
		imageUri: String
		name: String!
		description: String!
		price: Int!
		tags: [String!]!
	}
	input StoreInput {
		name: String!
		imageUri: String
		description: String!
	}
	input OrderInput {
		productId: String!
		storeId: String!
		quantity: Int!
	}
	input OrderDetails {
		meetTime: String
		details: String
		status: String
		message: String
	}
	enum Type {
		USER
		STORE
	}
	type Query {
		hello: String
		getProducts: [Product]
		getProduct(id: ID): Product!
		user: User
		getStore(id: ID!): StoreMessage!
		getCategories: [Category]!
		getOrders(type: Type!): OrderMessage!
		search(search: String!): [Product]!
		isOrder: IsOrderMessage!
		getPricing: PricingMessage!
		getTransactions: TransactionMessage!
	}
	type Mutation {
		addUser(
			username: String!
			emailAddress: String!
			password: String!
		): UserMessage!
		addInterests(interests: [ID!]!): String!
		register(email: String!, id: String!): UserMessage!
		updateUser(data: UserInput): UserMessage!
		login(username: String!, password: String!): UserMessage!
		signS3(filename: String!, fileType: String!): String!

		addStore(
			name: String!
			imageUri: String
			description: String!
		): StoreMessage
		initStore: StoreMessage!
		updateStore(id: ID!, store: StoreInput!): StoreMessage!
		deleteStore(id: ID!): StoreMessage!

		addProduct(product: ProductInput!): ProductMessage!
		updateProduct(id: ID!, product: ProductInput!): ProductMessage!
		deleteProduct(id: ID!): ProductMessage!

		addComment(id: ID!, comment: String!): CommentMessage!

		placeOrder(orders: [OrderInput]!): OrdersMessage!
		updateOrder(
			type: Type!
			orderId: String!
			order: OrderDetails!
		): OrdersMessage!
		markRead(type: Type!, ids: [ID]!): ReadMessage!
		cancelOrder(type: Type!, id: ID!): OrdersMessage!
		buyClients(ref: String!): Int!
	}
`;

module.exports = typeDefs;
