import { React, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { getAllServices } from './api/services';
import { getAllBundles } from './api/bundles';
import { getAllOrders } from './api/orders';
import { getAllUsers } from './api/auth';
import {
  NavBar,
  Home,
  AllBundles,
  About,
  Testimonials,
  ServiceForm,
  Dashboard,
  UserNav,
  ContactForm,
  Footer,
  FAQs,
} from './Components/Index';
import UserCart from './CartComponents/UserCart';
import AdminServices from './AdminComponents/AdminServices';
import IsCompleteOrd from './AdminComponents/IsCompleteOrd';
import NotCompleteOrd from './AdminComponents/NotCompleteOrd';
import AdminUsers from './AdminComponents/AdminUsers';
import { Signup, Login } from './Components/AuthForm';
import { useAuth } from './custom-hooks';
import SlideShow from './Components/SlideShow';

// import { AuthForm } from './Components/AuthForm';

function App() {
  const { token, isLoggedIn, logout, user } = useAuth();
  const [services, setServices] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [todaysDate, setTodaysDate] = useState(new Date());

  useEffect(() => {
    let today = setInterval(() => setTodaysDate(new Date()), 86400000);
    return function cleanup() {
      clearInterval(today);
    };
  });

  console.log('this is date', todaysDate);

  useEffect(() => {
    const fetchedServices = async () => {
      const allServices = await getAllServices();
      setServices(allServices);
    };
    fetchedServices();
    const fetchedBundles = async () => {
      const allBundles = await getAllBundles();
      setBundles(allBundles);
    };
    fetchedBundles();
    const fetchedUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      console.log('allusers here ', allUsers);
    };
    fetchedUsers();
  }, []);

  useEffect(() => {
    const fetchedOrders = async () => {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
    };
    fetchedOrders();
  }, [user.token]);

  console.log('USER INAPP:', user);

  // (!user.isadmin)
  return (
    <div className='App'>
      {user.isadmin === true ? <Dashboard /> : null}
      <div>
        <div>
          <Routes>
            <Route
              path='/'
              element={
                <div>
                  <NavBar logout={logout} orders={orders} />
                  <Home /> <About />
                  {/* <div id='service-form'>
                    <ServiceForm services={services} todaysDate={todaysDate} />
                  </div> */}
                  <SlideShow />
                  <div id='bundle-main'>
                    <AllBundles
                      services={services}
                      todaysDate={todaysDate}
                      bundles={bundles}
                    />
                  </div>
                  <FAQs />
                  <Testimonials />
                  <Footer />
                </div>
              }
            ></Route>

            <Route
              path='/login'
              element={
                <div>
                  <UserNav />
                  {Login}
                </div>
              }
            />
            <Route
              path='/signup'
              element={
                <div>
                  <UserNav />
                  {Signup}
                </div>
              }
            />

            <Route
              path='/allservices'
              element={
                <div>
                  <UserNav />
                  <AdminServices services={services} />
                </div>
              }
            />
            <Route
              path='/completedorders'
              element={
                <div>
                  <UserNav />
                  <IsCompleteOrd orders={orders} />
                </div>
              }
            />
            <Route
              path='/incompleteorders'
              element={
                <div>
                  <UserNav />
                  <NotCompleteOrd orders={orders} setOrders={setOrders} />
                </div>
              }
            />
            <Route
              path='/allusers'
              element={
                <div>
                  <UserNav />
                  <AdminUsers users={users} />
                </div>
              }
            />
            <Route
              path='/usercart/*'
              element={
                <div>
                  <UserNav />
                  <UserCart
                    bundles={bundles}
                    orders={orders}
                    todaysDate={todaysDate}
                  />
                </div>
              }
            ></Route>
          </Routes>
          <a id='back-to-top' href='#top'>
            Back to Top
          </a>
          <div>©Copyright 2023 Creative Juices</div>
        </div>
      </div>
    </div>
  );
}

export default App;
