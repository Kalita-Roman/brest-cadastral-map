brest-map
=========
Приложение предназначено для ведения архитекторами дежурной карты градостроительного кадастра города.
Простой посетитель может просто зайти по ссылке</br>
[https://brest-map-db.herokuapp.com] (https://brest-map-db.herokuapp.com)</br>
В данном случае приложение будет иметь ограниченный функционал. Только для просмотра информации.
Справа вверху можно отключить слой с помощью "галочки" или изменить его прозрачность с помощью "ползунка".

Для редакторов (дежурных по карте) вход осуществляется по сслыке</br>
[https://brest-map-db.herokuapp.com/login] (https://brest-map-db.herokuapp.com/login)</br>
Они могут редактировать карту и записи в БД.
редактор</br>
 пользователь:  123</br>
 пароль:        123</br>
Если заходит администратор</br>
Он может делать то что и редактор и изменять списко редакторов.
 пользователь:  rok</br>
 пароль:        rok</br>

Кнопку "Вход"/"Log in" не сделана потому что редакторов ограниченное количество и чтобы она не "мозолила" глаза посетителю.

При входе в режим редактора в левом верхнем углу карты появляются инструменты ввода, радактировния формы и удаления объектов.
Справа вверху в полях слоев повляются элементы для отображения текущего слоя (красная кнопка - текущий слой, серая - не актинвый).
Редактировать инофрмацию об объекте можно кликнув по нему.
На формах редактирования под полями ввода отображается фамилия последнего редактора изменявшего запись.