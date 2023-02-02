// const APIURL = `https://creative-juices.fly.dev/api`;
const BASE_API = `/api`;

export const getAllOrders = async () => {
  try {
    const response = await fetch(`${BASE_API}/orders`);
    const results = await response.json();
    return results;
  } catch (error) {
    console.error(error);
  }
};

export const getAllTheOrdersByUser = async (token, username) => {
  console.log('accessing get order by purchaser id honhon: ', username);
  console.log('accessing get order by purchaser id TOKEN honhon: ', token);
  try {
    const response = await fetch(`${BASE_API}/orders/${username}/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const results = await response.json();
    console.log('this is results in ordersapi', results);
    return results;
  } catch (error) {
    console.error(error);
  }
};

export const getAllTheOrdersByComplete = async (token, iscomplete) => {
  console.log('accessing get order by purchaser id honhon: ', iscomplete);
  console.log('accessing get order by purchaser id TOKEN honhon: ', token);
  try {
    const response = await fetch(
      `${BASE_API}/orders/${iscomplete}/mycartorders`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const results = await response.json();
    console.log('this is results in ordersapi', results);
    return results;
  } catch (error) {
    console.error(error);
  }
};

export const createNewOrder = async (
  token,
  orderDate,
  purchaserId,
  serviceId,
  bundlekitId
) => {
  try {
    const response = await fetch(`${BASE_API}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderDate,
        purchaserId,
        serviceId,
        bundlekitId,
      }),
    });
    const newOrder = await response.json();
    console.log('this is new ORDER', newOrder);
    return newOrder;
  } catch (error) {
    console.error(error);
  }
};

export const updateOrder = async (
  token,
  orderId,
  orderdate,
  purchaserId,
  iscomplete,
  incart,
  serviceId,
  bundlekitId
) => {
  try {
    const response = await fetch(`${BASE_API}/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderdate,
        orderId,
        purchaserId,
        iscomplete,
        incart,
        serviceId,
        bundlekitId,
      }),
    });
    const updatedOrder = await response.json();
    console.log('this is our updated ORDER', updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error(error);
  }
};
