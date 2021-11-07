package types

import (
	"encoding/json"
	"fmt"
	"strings"
)

type JSON_key []uint8

func (u JSON_key) MarshalJSON() ([]byte, error) {
	var result string
	if u == nil {
		result = "null"
	} else {
		result = "\"" + strings.Join(strings.Fields(fmt.Sprintf("%d", u)), ",") + "\""
	}
	return []byte(result), nil
}

func (result *JSON_key) UnmarshalJSON(b []byte) error {
	int_arr := []int{}
	err := json.Unmarshal(b[1:len(b)-1], &int_arr)
	if err != nil {
		return err
	}
	key := make([]uint8, len(int_arr))
	for i, item := range int_arr {
		key[i] = uint8(item)
	}
	*result = key
	return nil
}
