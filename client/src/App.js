import logo from "./logo.svg";
import "./App.css";
// dev dependencies
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";
import { useSelector } from "react-redux";
// components
import SignInScreen from "./screens/SignInScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import AddProductScreen from "./screens/AddProductScreen";
import AddStoreScreen from "./screens/AddStoreScreen";
import MessagingScreen from "./screens/MessagingScreen";
import NavigationBar from "./components/NavigationBar";
import CartScreen from "./screens/CartScreen";
import StoreScreen from "./screens/StoreScreen";
import SearchScreen from "./screens/SearchScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AdministrativePanel from "./screens/AdministrativePanel";
import OrdersScreen from "./screens/OrdersScreen";
import PricingScreen from "./screens/PricingScreen";
import CategoryScreen from "./screens/CategoryScreen";
import ConfirmEmailScreen from "./screens/ConfirmEmailScreen";
import ActivateSuccessScreen from "./screens/ActivateSuccessScreen";
import TransactionScreen from "./screens/TransactionScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrderScreen from "./screens/OrderScreen";

function App() {
	const accountReducer = useSelector((state) => state.accountReducer);
	const isAuthenticated = accountReducer.token;
	return (
		<Router>
			<div className="super-container">
				<NavigationBar search />
				<Switch>
					<Route path="/" exact component={HomeScreen} />
					<Route path="/Auth" component={AdministrativePanel} />
					<Route path="/product/:id" component={ProductDetailScreen} />
					<Route path="/cart" component={CartScreen} />
					<Route path="/signIn" component={SignInScreen} />
					<Route path="/signUp" component={SignUpScreen} />
					<Route path="/search" component={SearchScreen} />
					<Route path="/category" component={CategoryScreen} />
					<Route path="/confirmEmail" component={ConfirmEmailScreen} />
					<Route path="/success" component={ActivateSuccessScreen} />
					<Route
						path="/store/:id"
						component={StoreScreen}
						key="store-component"
					/>
					{isAuthenticated ? (
						<>
							<Route path="/profile" component={ProfileScreen} />
							<Route path="/pricing" component={PricingScreen} />
							<Route
								path="/account"
								component={StoreScreen}
								key="account-component"
							/>
							<Route path="/transactions" component={TransactionScreen} />
							<Route path="/messages" component={MessagingScreen} />
							<Route path="/orders" component={OrderScreen} key="orders" />
							<Route path="/inbox" component={OrderScreen} key="inbox" />
							<Route path="/addProduct" component={AddProductScreen} />
							<Route path="/addStore" component={AddStoreScreen} />
						</>
					) : (
						<Redirect to="/signIn" />
					)}
				</Switch>
			</div>
		</Router>
	);
}

export default App;
