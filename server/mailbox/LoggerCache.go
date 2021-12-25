package mailbox

var logCache = make([]interface{}, 1000) // Mögliche Typen: InputMessagesLogger, OutputMessageLogger, ServerMessageLogger
var logCacheHead = 0
var logCacheTail = -999

func ClearLogCache() {
	logCache = make([]interface{}, 1000)
	logCacheHead = 0
	logCacheTail = -1000
}

func addToLogCache(item interface{}) {
	logCache[logCacheHead] = item
	logCacheHead = (logCacheHead + 1) % 1000
	if logCacheTail < 0 {
		logCacheTail += 1
	} else {
		logCacheTail = (logCacheTail + 1) % 1000
	}
}
