package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "github.com/golang-jwt/jwt/v5"
    "time"
)

var jwtKey = []byte("secret_key") // Chave para JWT
var users = map[string]string{}    // map[email]password
var foods = []map[string]string{   // Comidas mockadas
    {"id": "1", "name": "Pizza de Calabresa", "image": "https://example.com/pizza.jpg", "link": "https://ifood.com/pizza"},
    {"id": "2", "name": "Sushi Combo", "image": "https://example.com/sushi.jpg", "link": "https://ifood.com/sushi"},
    {"id": "3", "name": "Hambúrguer Artesanal", "image": "https://example.com/burger.jpg", "link": "https://ifood.com/burger"},
}

type Credentials struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

func main() {
    r := gin.Default()

    // Habilita CORS para qualquer origem
    r.Use(cors.Default())

    r.POST("/register", register)
    r.POST("/login", login)
    r.GET("/foods", getFoods)

    r.Run(":8080")
}

// Handler de registro
func register(c *gin.Context) {
    var creds Credentials
    if err := c.BindJSON(&creds); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": "JSON inválido"})
        return
    }

    if _, exists := users[creds.Email]; exists {
        c.JSON(http.StatusBadRequest, gin.H{"message": "Usuário já existe"})
        return
    }

    users[creds.Email] = creds.Password
    c.JSON(http.StatusOK, gin.H{"message": "Usuário registrado com sucesso"})
}

// Handler de login
func login(c *gin.Context) {
    var creds Credentials
    if err := c.BindJSON(&creds); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"message": "JSON inválido"})
        return
    }

    pass, exists := users[creds.Email]
    if !exists || pass != creds.Password {
        c.JSON(http.StatusUnauthorized, gin.H{"message": "Credenciais inválidas"})
        return
    }

    // Gerar JWT
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "email": creds.Email,
        "exp":   time.Now().Add(time.Hour * 72).Unix(),
    })

    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"message": "Erro ao gerar token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// Handler de comidas
func getFoods(c *gin.Context) {
    authHeader := c.GetHeader("Authorization")
    if authHeader == "" {
        c.JSON(http.StatusUnauthorized, gin.H{"message": "Token ausente"})
        return
    }

    // Validar JWT
    token, err := jwt.Parse(authHeader, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, jwt.ErrSignatureInvalid
        }
        return jwtKey, nil
    })

    if err != nil || !token.Valid {
        c.JSON(http.StatusUnauthorized, gin.H{"message": "Token inválido"})
        return
    }

    c.JSON(http.StatusOK, foods)
}
