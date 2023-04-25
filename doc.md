## API Reference

#### Get all Tweet From Users 

```http
  GET /api/tweet?user=${userid}/
  -H 'number: ${number}'/
  -H 'filter: ${filter}'/
```
#### Parameter
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userid` | `string` | **Required**. The user id |
| `number` | `int` | **Required**. The number of tweet wanted |
| `filter` | `string` | **Optional**. Filter by time, "asc" for ascendant(default), "desc for descendant" |

#### Exemple return

````json
{
  "status": 200,
  "data": [
    {
      "Tweet id": 123456789,
      "Date": "18/08/2023",
      "Content": "Waw cette documentation d'api est juste insane",
      "like": 999999999,
      "comment": 9999999999999
    },
    {
      "Tweet id": 987654321,
      "Date": "19/08/2023",
      "Content": "Tellment plus rapide d'uttilisé cette api que le vraie tweeter ! !",
      "like": 88888888,
      "comment": 888888888888
    }
  ]
}

````

_____________________
#### Follow/Unfollow User

```http
  POST /api/follow?user=${userid}/
  -H 'Action: ${action}'
```


#### Parameter
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userid`      | `string` | **Required**. The user id of the target account|
| `action`      | `string` | **Required**. "follow" for follow someone, "Unfollow" for unfollow|

#### Exemple return
````json
{
  "status": 200,
  "return": "Follow with success",
}
````