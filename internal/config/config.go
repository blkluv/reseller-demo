package config

import "os"

type Config struct {
	BearerToken string
	ListenAddr  string
	DBPath      string
	UseSandbox  bool
}

func Load() *Config {
	cfg := &Config{
		BearerToken: os.Getenv("UNSTOPPABLEDOMAINSSDK_BEARER"),
		ListenAddr:  os.Getenv("LISTEN_ADDR"),
		DBPath:      os.Getenv("DB_PATH"),
		UseSandbox:  os.Getenv("UD_SANDBOX") == "true",
	}
	if cfg.ListenAddr == "" {
		cfg.ListenAddr = ":8080"
	}
	if cfg.DBPath == "" {
		cfg.DBPath = "./data.json"
	}
	return cfg
}
