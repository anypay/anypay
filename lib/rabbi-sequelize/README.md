
# Rabbi Sequelize

Binds hooks from sequelize models to published events in amqp


Following is the formula for getting the routing key for a particular model
and its hook.
```

let modelName = 'AddressRoute';

let hookName = 'afterCreate';

routingKey = `models.${modelName}.{hookName}`


```
