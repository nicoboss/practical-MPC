package JSON

import (
	"encoding/json"
)

func ToObj(str []byte, obj interface{}) {
	err := json.Unmarshal(str, obj)
	if err != nil {
		panic(err)
	}
}
