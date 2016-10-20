Calculador de precio de carrito de compra
=========================================

Con este test pretendemos sólo evaluar tus conocimientos de OOP y, más específicamente, su implementación en PHP. No necesitarás añadir integración con ninguna infraestructura ni, en cualquier caso, implementar una aplicación web.

#Implementación

##El Dominio

ATRAPALO necesita implementar un nuevo Sistema de gestión de pedidos. Para ello empezaremos por el cálculo del precio del carrito basado en sus líneas (Lines).
Cada línea está compuesta de un artículo (Item) y su cantidad. Para simplificar, las cantidades siempre se expresarán en unidades y serán siempre enteros.
Para el cálculo de precios se quiere que el sistema pueda incorporar diferentes métodos de cálculo de modo que cada método se aplique solo si se puede.
Cada línea será calculada según un solo método. Los métodos actuales son "3 x 2", "con % de descuento" y "por unidad" siendo este el orden de prioridad de aplicación. Se podrá ir añadiendo nuevos métodos de cálculo
a medida que el negocio lo requiera ("últimas unidades", "paquetes", etc).

Cada método de cálculo de precio puede ser aplicado solo a un grupo específico de artículos. Un artículo puede tener varios métodos de cálculo asociados pero siempre se aplicará sólo uno.
Por ejemplo, si a un artículo AAA se le puede aplicar el cálculo "3 X 2" y el "con % de descuento" se le aplicará el "3 X 2" ya que tiene prioridad siempre que la línea de carrito tenga más de tres unidades, aplicando el porcentaje de descuento en caso contrario.
La lista de precios y ofertas es la siguiente:


|SKU|Estrategia de precio|Valor|
|---|---|---|
|AAA|por unidad|100 EUR|
||% descuento|10%|
||3 X 2| - |
|BBB|por unidad|55 EUR|
||% descuento|5%|
|CCC|por unidad|25 EUR|
|DDD|por unidad|25 EUR|
||% descuento|10%|
||3 X 2| - |


##La solución

Esta prueba se entrega con un test de componente en el que se comprueba la interacción al completo de la feature requerida. Para probarlo ejecuta:

```$ vendor/bin/phpunit tests/integration/ ```

Por otro lado, es necesario que la prueba se entregue con los tests unitarios necesarios. Para ello ejecutaremos:

```$ vendor/bin/phpunit tests/unit/ ```

###Se valorará positivamente:

* La implementación correcta de los tests unitarios
* Correcta aplicación de los principios SOLID
* Correcta aplicación de patrones de diseño. No te preocupes con la sobre ingeniería...se trata de lucirse ;)

El objetivo es hacer que el test que se incluye en la prueba pase sin modificarlo ;). Para ello puedes modificar, añadir o eliminar cualquier clase e interfaz que consideres necesario.

Recuerda:
```$ vendor/bin/phpunit tests/integration/ ```


## Comentarios a la solución aportada:

* Todos los tests (de integración y unitarios) pasan correctamente. He utilizado PHP 7.0.7 en Apache (Windows 10) con PHPUnit y Composer.

* He hecho que arroje excepciones sólo cuando he creído necesario (sobre todo en partes que he considerado más críticas), pero en otros métodos (como setDiscountsPerQuantity de la clase BasicItem, etc.) intenta arreglar los parámetros dados si no son los correctos. Sólo es una decisión que puede modificarse fácilmente.

* Tal como pedía el enunciado, ahora el descuento que depende de la cantidad lo que hace es dar unos productos gratis por cada cierto número (por ejemplo en el caso de 3 x 2, serían 1 producto gratis por cada 2 que se compran). Pero podría ser interesante también aplicar otros tipos de descuentos como un porcentaje de descuento al superar ciertas cantidades, etc.

* Tal como se espera según el enunciado y los tests de integración aportados, el descuento de porcentaje se aplica a cada producto (item) individualmente y no al total.

* Sobre todo en los tests, no he tenido demasiado en cuenta el rendimiento ni simplificación de código. Puedo hacerlo mejor si así se desea pero quería entregarlo más o menos a tiempo.

* He visto interesante que la clase BasicLines implementara las interfaces Iterator y Countable para hacer que se comportara similar a una array y poder interarla en un for, etc. en caso de ser necesario. Pero esta funcionalidad no es realmente necesaria de momento por lo que puede ser suprimida.

* Siento el tiempo tomado. Comencé ayer y he acabado hoy porque no tengo mucho tiempo y lo hago después del trabajo.

* Si es necesario que implemente alguna cosa más o arregle algo, estoy dispuesto a hacer lo que haga falta.