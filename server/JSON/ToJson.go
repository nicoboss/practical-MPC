package JSON

import (
	"encoding/json"
	"log"
)

func ToJSON(obj interface{}) string {
	jsonObj, err := json.Marshal(obj)
	if err != nil {
		log.Fatalln(err)
	}
	return string(jsonObj)
}
