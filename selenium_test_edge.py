from selenium import webdriver
from selenium.webdriver.edge.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time

service = Service(executable_path="msedgedriver.exe")
driver = webdriver.Edge(service=service)
driver.maximize_window()

try:
    driver.get("http://localhost:4200/login")

    # 1. Medir carga del login
    tiempo_inicial = time.time()
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "username"))
    )
    print("1) Tiempo de carga del login:", round(time.time() - tiempo_inicial, 2), "segundos")

    # 2. Ingresar usuario
    username_input = driver.find_element(By.ID, "username")
    username_input.send_keys("admin")
    print("2) Usuario ingresado correctamente")

    # 3. Ingresar contraseña
    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("12345")
    print("3) Contraseña ingresada correctamente")

    # 4. Click en ingresar y esperar productos
    login_button = driver.find_element(By.ID, "login-btn")
    login_button.click()

    tiempo_inicial = time.time()
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "add-product-1"))
    )
    print("4) Login correcto. Tiempo de carga de productos:", round(time.time() - tiempo_inicial, 2), "segundos")

    # 5. Comprar dos productos e ir al carrito
    driver.find_element(By.ID, "add-product-1").click()
    driver.find_element(By.ID, "add-product-2").click()
    print("5) Dos productos agregados al carrito")

    driver.find_element(By.ID, "view-cart-btn").click()

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "cart-total"))
    )

    producto_1 = driver.find_element(By.ID, "cart-item-1").text
    producto_2 = driver.find_element(By.ID, "cart-item-2").text
    total = driver.find_element(By.ID, "cart-total").text

    print("Producto 1 en carrito:", producto_1)
    print("Producto 2 en carrito:", producto_2)
    print("Total del carrito:", total)

    time.sleep(5)

finally:
    driver.quit()
