package types

func Contains(s []string, str string) bool {
	for _, item := range s {
		if item == str {
			return true
		}
	}
	return false
}
