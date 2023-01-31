const client = require('./client');
// const { getAllUsers } = require('./users');

async function getAllOrders() {
  try {
    const { rows } = await client.query(`
  SELECT *
  FROM orders;
  `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createOrder({
  orderdate,
  purchaserId,
  iscomplete,
  incart,
  serviceId,
  bundlekitId,
}) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
            INSERT INTO orders (orderdate, "purchaserId", iscomplete, incart, "serviceId", "bundlekitId")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `,
      [orderdate, purchaserId, iscomplete, incart, serviceId, bundlekitId]
    );
    console.log('this is the order:', order);
    return order;
  } catch (error) {
    console.log('this is error in adduserstoorders:', error);
    throw error;
  }
}

async function getOrderById(orderid) {
  try {
    const { rows: order } = await client.query(`
    SELECT *
    FROM orders
    WHERE id = ${orderid};
    `);
    console.log('this is our get order by id:', order);
    return order;
  } catch (error) {
    throw error;
  }
}

async function attachUserToOrder(orders) {
  const ordersToReturn = [...orders];
  try {
    const { rows: usersinfo } = await client.query(`
        SELECT users.* 
        FROM users
        JOIN orders ON users.id = orders."purchaserId"
        WHERE orders."purchaserId" = users.id
        `);

    for (const order of ordersToReturn) {
      const usersToAdd = usersinfo.filter(
        (user) => user.id === order.purchaserId
      );
      order.usersinfo = usersToAdd;
      console.log('this is the user to add:', usersToAdd);
    }

    console.log('this is the order to return:', ordersToReturn);
    return ordersToReturn;
  } catch (error) {
    console.log('this is the attach user to order error:', error);
    throw error;
  }
}

async function getAllOrdersByUser(username) {
  console.log('username:', username);
  try {
    const { rows: orders } = await client.query(
      `
            SELECT orders.*
            FROM orders
            JOIN users ON orders."purchaserId" = users.id
            WHERE users.username = $1 AND orders."purchaserId" = users.id
            `,
      [username]
    );

    console.log('this is the order', orders);

    const allOrders = await attachUserToOrder(orders);

    return allOrders;
  } catch (error) {
    throw error;
  }
}

//getServicesByOrder
//getBundlesByOrder

module.exports = {
  createOrder,
  getOrderById,
  attachUserToOrder,
  getAllOrders,
  getAllOrdersByUser,
};
