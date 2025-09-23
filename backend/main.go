package main

import "github.com/gin-gonic/gin"

func main() {
    r := gin.Default()

    // rota de teste
    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })

    // servidor rodando na porta 8080
    r.Run(":8080")
}
