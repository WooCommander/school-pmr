Ниже разумная декомпозиция. Сразу все делать не стоит: тут есть продуктовая модель, права, архитектура данных, конструктор шаблонов и UX админки.

Этап 1. Модель системы

Зафиксировать сущности.
Школа, публичный сайт школы, пользователь, роль, шаблон, тема, раздел, страница, новость, документ, галерея, меню, блок главной, набор настроек школы.

Зафиксировать уровни кастомизации.
Что школа может менять без кода:

шаблон сайта из 5 готовых
цветовую тему из 10 готовых
логотип, название, контакты
порядок разделов меню
включение/отключение разделов
добавление пользовательских разделов
настройку главной страницы блоками
базовые тексты и баннеры
Зафиксировать границы.
Что нельзя менять через админку:
базовую кодовую структуру
произвольную верстку
произвольный CSS
сложную логику компонентов
Этап 2. Роли и права

Составить матрицу ролей.
Базовый набор:
superadmin — управляет всей системой и всеми школами
school_admin — полный админ конкретной школы
director — управляет структурой и публикацией
vice_principal — управляет учебными/организационными разделами
content_manager — новости, страницы, документы, медиа
teacher — ограниченный доступ к своим разделам
editor или moderator — проверка и публикация контента
Определить права по объектам.
Например:
кто меняет тему
кто выбирает шаблон
кто создает разделы
кто публикует новости
кто редактирует документы
кто управляет пользователями школы
Определить режим доступа.
Пользователь входит не “в систему вообще”, а в контекст своей школы, если у него нет роли superadmin.
Этап 3. Архитектура админки

Разделить админку на 2 контура.
системная админка
админка конкретной школы
Разбить админку школы на модули.
Дашборд
Сайт школы
Разделы и меню
Новости
Страницы
Документы
Галерея
Пользователи и роли
Настройки школы
Оформление
Определить отдельный layout админки.
Это должен быть отдельный модуль, не смешанный с публичным layout.
Этап 4. Конструктор шаблонов

Описать 5 шаблонов как конфигурации.
Не 5 разных хаотичных сайтов, а 5 управляемых preset-структур:
классический
современный
академический
медиа-акцент
компактный
Для каждого шаблона определить настраиваемые зоны.
hero
карточки разделов
блок новостей
блок документов
CTA-блоки
боковые панели
footer-варианты
Задать ограничения кастомизации.
Например школа может:
менять порядок блоков
скрывать блоки
выбирать стиль карточек
выбирать плотность/акценты
Но не может “сломать” шаблон.
Этап 5. Темизация

Сделать токены темы.
Не просто “10 цветов”, а набор theme tokens:
primary
secondary
accent
surface
surface-alt
text-primary
text-secondary
border
success/warning/error
Подготовить 10 готовых тем.
Например:
classic blue
deep navy
emerald
burgundy
graphite
sand
teal
royal purple
terracotta
slate
Добавить легкую кастомизацию поверх темы.
Школа может:
выбрать тему
переключить контрастность
выбрать форму радиусов
выбрать плотность интерфейса
выбрать стиль кнопок/карточек в рамках шаблона
Этап 6. Динамические разделы

Ввести понятие системных и пользовательских разделов.
системные: новости, документы, контакты, галерея
пользовательские: “Олимпиада”, “Кружки”, “Поступающим”, “Методкабинет” и т.д.
Определить структуру пользовательского раздела.
Минимум:
slug
title
тип
видимость
порядок
шаблон отображения
связанные страницы/материалы
Ограничить типы динамических разделов.
Лучше не “любой конструктор”, а набор типов:
страничный раздел
список материалов
карточки
FAQ
документы
галерея
анонсы
Этап 7. UX админки

Сделать настройку наглядной.
Не таблицы с JSON, а:
preview карточки шаблона
preview темы
drag-and-drop порядок разделов
toggles для видимости
form-based настройка блоков
Добавить live preview.
Школа должна видеть:
как выглядит тема
как выглядит шаблон
как меняется главная
Разделить “простые” и “расширенные” настройки.
Чтобы директору не показывать лишнее, а school_admin мог открыть больше.
Этап 8. Данные и backend

Спроектировать схему хранения.
Нужно отдельно хранить:
school profile
school theme config
school template config
enabled modules
menu structure
dynamic sections
role assignments
Решить, где хранятся шаблоны.
Правильно:
шаблоны в коде
настройки шаблонов в БД
Продумать версионирование настроек.
Чтобы смена шаблона/темы была откатываемой.
Этап 9. MVP админки
Первый релиз не должен включать все.
MVP:

вход
роли superadmin и school_admin
выбор школы
редактирование профиля школы
выбор 1 из 5 шаблонов
выбор 1 из 10 тем
управление меню
включение/выключение системных разделов
новости и документы
preview перед публикацией
Этап 10. Второй релиз
После MVP:

director / vice_principal / teacher / content_manager
динамические разделы
настройка блоков главной
медиа-библиотека
черновики / публикация / модерация
история изменений
live preview
Рекомендуемый порядок выполнения

Описать роли и права.
Описать сущности и конфиг школы.
Спроектировать 5 шаблонов и 10 тем как систему токенов.
Спроектировать структуру админки.
Сделать MVP админки без динамических разделов.
Потом добавлять расширенную кастомизацию.
Если хотите, следующим сообщением я разобью это уже в технический backlog в формате:

Epic
User story
Acceptance criteria
Priority
Начал бы именно с этого.

0:49
погнали
0:54

Epic 1. Foundation

Story: Как архитектор системы, я хочу разделить публичный портал выбора школы и сайт конкретной школы, чтобы дальше без хаоса строить админку и кастомизацию.
Acceptance criteria:
Есть отдельный контур portal
Есть отдельный контур school-site
Есть отдельный контур admin
У школы есть стабильный schoolSlug
Все школьные данные привязаны к schoolSlug
Priority: P0
Story: Как разработчик, я хочу иметь единую модель школы, чтобы все настройки, роли и контент хранились согласованно.
Acceptance criteria:
Описана сущность School
Описаны сущности SchoolTheme, SchoolTemplate, SchoolModule, SchoolMenuItem
Описаны системные и пользовательские разделы
Priority: P0
Epic 2. Auth And Access

Story: Как пользователь системы, я хочу входить в личный кабинет своей школы, чтобы управлять только своим сайтом.
Acceptance criteria:
Есть login/logout
Пользователь может быть привязан к одной или нескольким школам
После входа открывается список доступных школ или сразу одна школа
Priority: P0
Story: Как владелец платформы, я хочу ролевую модель, чтобы разные сотрудники школы видели только свои функции.
Acceptance criteria:
Есть роли superadmin, school_admin, director, vice_principal, content_manager, teacher, editor
Есть permission matrix
Проверки прав работают на уровне UI и API
Priority: P0
Story: Как superadmin, я хочу управлять пользователями школы, чтобы выдавать и отзывать доступ.
Acceptance criteria:
Можно пригласить пользователя
Можно назначить роль
Можно отключить доступ
Все действия логируются
Priority: P1
Epic 3. Admin Shell

Story: Как сотрудник школы, я хочу понятную админку, чтобы быстро находить нужные настройки.
Acceptance criteria:
Есть отдельный admin layout
Есть sidebar/top navigation
Есть dashboard школы
Есть разделы Контент, Оформление, Структура, Пользователи, Настройки
Priority: P0
Story: Как пользователь админки, я хочу видеть текущую школу в шапке интерфейса, чтобы не перепутать контекст.
Acceptance criteria:
В admin header видны название школы и роль
При наличии нескольких школ можно переключать школу
Priority: P1
Epic 4. School Settings

Story: Как администратор школы, я хочу редактировать базовые данные школы, чтобы поддерживать сайт в актуальном состоянии.
Acceptance criteria:
Можно менять название
Можно менять краткое название
Можно менять адрес, телефон, email, часы работы
Можно загружать логотип и обложку
Priority: P0
Story: Как администратор школы, я хочу управлять SEO и служебными параметрами, чтобы сайт был корректно оформлен.
Acceptance criteria:
Можно задать title, description
Можно настроить favicon
Можно задать домен или поддомен
Priority: P2
Epic 5. Templates

Story: Как школа, я хочу выбрать один из 5 шаблонов, чтобы быстро получить подходящую структуру сайта.
Acceptance criteria:
Есть каталог из 5 шаблонов
У каждого шаблона есть preview
Шаблон можно применить без ручной доработки кода
Настройки школы не теряются при смене шаблона
Priority: P0
Story: Как школа, я хочу менять шаблон безопасно, чтобы не сломать опубликованный сайт.
Acceptance criteria:
Есть draft-preview перед применением
Есть confirm step
Есть rollback на предыдущий шаблон
Priority: P1
Story: Как продуктовая команда, мы хотим описать шаблоны как конфигурации, чтобы не плодить отдельные несвязанные реализации.
Acceptance criteria:
Каждый шаблон описан preset-конфигом
Есть список поддерживаемых блоков
Есть ограничения на несовместимые настройки
Priority: P0
Epic 6. Themes

Story: Как школа, я хочу выбрать цветовую тему, чтобы сайт отличался визуально.
Acceptance criteria:
Доступно минимум 10 готовых тем
Каждая тема имеет preview
Применение темы не ломает контрастность и читаемость
Priority: P0
Story: Как школа, я хочу слегка донастроить тему, чтобы подогнать сайт под свой стиль.
Acceptance criteria:
Можно выбрать primary/accent из ограниченного набора
Можно выбрать стиль кнопок
Можно выбрать радиусы/плотность
Нельзя ввести произвольный CSS
Priority: P1
Story: Как разработчик, я хочу хранить темы как design tokens, чтобы шаблоны и темы были совместимы.
Acceptance criteria:
Есть theme token schema
Все шаблоны используют токены, а не hardcoded цвета
Priority: P0
Epic 7. Structure And Navigation

Story: Как школа, я хочу включать и выключать системные разделы, чтобы структура сайта соответствовала реальным потребностям.
Acceptance criteria:
Можно скрыть/показать Новости, Документы, Галерея, Педагоги, Расписание, Контакты
Изменения сразу влияют на меню
Priority: P0
Story: Как школа, я хочу менять порядок разделов меню, чтобы строить удобную навигацию.
Acceptance criteria:
Есть reorder меню
Есть вложенность только если она действительно нужна
Есть desktop/mobile preview
Priority: P1
Story: Как школа, я хочу добавлять пользовательские разделы, чтобы расширять сайт без кода.
Acceptance criteria:
Можно создать новый раздел
Можно выбрать тип раздела
Можно задать slug, title, visibility, order
Priority: P1
Epic 8. Dynamic Sections

Story: Как школа, я хочу добавлять новые типовые разделы, чтобы сайт отражал специфику учреждения.
Acceptance criteria:
Есть типы simple-page, cards-list, documents-list, gallery, announcements, faq
Каждый тип имеет понятную форму настройки
Priority: P1
Story: Как школа, я хочу собирать главную страницу из блоков, чтобы не зависеть от разработчика.
Acceptance criteria:
Есть блоки hero, quick-links, news, documents, about, cta, contacts
Блоки можно менять местами
Блоки можно скрывать
У блоков есть preview
Priority: P1
Epic 9. Content Management

Story: Как контент-менеджер, я хочу публиковать новости своей школы, чтобы наполнять сайт актуальным контентом.
Acceptance criteria:
CRUD новостей
Категории новостей
Draft/published states
Публикация только при наличии прав
Priority: P0
Story: Как школа, я хочу вести документы отдельно по своей школе, чтобы публичная информация была индивидуальной.
Acceptance criteria:
CRUD документов
Категории документов
Загрузка файлов
Публичные ссылки на файлы
Priority: P0
Story: Как школа, я хочу управлять галереей, чтобы показывать мероприятия и жизнь школы.
Acceptance criteria:
Загрузка изображений
Альбомы или категории
Порядок изображений
Priority: P1
Story: Как школа, я хочу вести страницы “О школе”, “Поступающим”, “Родителям”, чтобы не править код.
Acceptance criteria:
CRUD страниц
WYSIWYG или block editor
Draft/published
Priority: P1
Epic 10. User Experience Of Customization

Story: Как директор или администратор школы, я хочу видеть наглядный preview оформления, чтобы принимать решение без технических знаний.
Acceptance criteria:
Есть preview шаблона
Есть preview темы
Есть preview главной
Есть preview меню
Priority: P0
Story: Как нетехнический пользователь, я хочу простые настройки, чтобы не “влезать в систему”.
Acceptance criteria:
Есть режим Базовые настройки
Есть режим Расширенные настройки
Базовый режим покрывает 80% типовых задач
Priority: P1
Epic 11. Workflow And Moderation

Story: Как директор, я хочу контролировать публикацию важных изменений, чтобы сайт школы не менялся случайно.
Acceptance criteria:
Есть роли автора и утверждающего
Есть draft/review/published
Есть история изменений
Priority: P1
Story: Как администратор, я хочу откатить неудачные изменения оформления, чтобы быстро восстановить сайт.
Acceptance criteria:
Есть revision history для темы, шаблона и структуры
Можно откатить последнюю версию
Priority: P1
Epic 12. MVP Scope
Это то, что реально стоит делать первым релизом.

MVP includes:

portal page выбора школы
school site routing by slug
login
роли superadmin и school_admin
редактирование данных школы
выбор 1 из 5 шаблонов
выбор 1 из 10 тем
управление меню
включение/выключение системных разделов
новости
документы
preview перед публикацией
Not in MVP:

teacher self-service
сложные динамические разделы
продвинутый block-builder
многоступенчатое согласование
глубокая визуальная кастомизация
Приоритетный backlog на старт

P0 Спроектировать data model школы, шаблона, темы, ролей.
P0 Спроектировать auth + school-scoped access.
P0 Сделать admin shell.
P0 Сделать school settings.
P0 Сделать template system на 5 шаблонов.
P0 Сделать theme system на 10 тем.
P0 Сделать menu/section visibility.
P0 Сделать CRUD новостей и документов.
P1 Сделать preview и rollback.
P1 Сделать dynamic sections.
Рекомендую следующий шаг
Сейчас лучше не кодить дальше вслепую, а сначала оформить технический blueprint MVP:

схема сущностей
роли и права
список таблиц/коллекций
структура admin routes
формат конфигов шаблонов и тем
Если хотите, следующим сообщением я сделаю именно это: MVP blueprint админки в прикладном виде для реализации.

0:54
го
0:56

MVP Blueprint

1. Цель MVP
   Сделать систему, где:

пользователь входит в админку
попадает в контекст своей школы
редактирует данные школы
выбирает 1 из 5 шаблонов
выбирает 1 из 10 тем
управляет меню и видимостью разделов
ведет новости и документы
смотрит preview перед публикацией 2. Контуры системы

Portal
Страница выбора школы, публичная.

School Site
Публичный сайт конкретной школы по slug.

Admin
Закрытая зона управления школой.

3. Основные маршруты
   Публичные:

/
/school/:slug
/school/:slug/news
/school/:slug/news/:id
/school/:slug/teachers
/school/:slug/schedule
/school/:slug/documents
/school/:slug/gallery
/school/:slug/contacts
Админка:

/admin/login
/admin
/admin/select-school
/admin/school/:slug/dashboard
/admin/school/:slug/settings
/admin/school/:slug/design
/admin/school/:slug/navigation
/admin/school/:slug/news
/admin/school/:slug/news/new
/admin/school/:slug/news/:id
/admin/school/:slug/documents
/admin/school/:slug/users 4. Роли MVP
На первый релиз достаточно:

superadmin
school_admin
Подготовить под расширение:

director
vice_principal
content_manager
teacher
editor 5. Права MVP
superadmin:

все школы
все пользователи
все шаблоны
все темы
school_admin:

только своя школа
настройки школы
оформление
меню
новости
документы
локальные пользователи школы 6. Сущности
School

id
slug
fullName
shortName
type
city
address
phone
email
hours
logoUrl
heroTitle
heroText
isPublished
User

id
email
passwordHash
name
isActive
UserSchoolRole

id
userId
schoolId
role
ThemePreset

id
key
name
tokens
TemplatePreset

id
key
name
description
previewImage
supportedBlocks
SchoolDesignConfig

id
schoolId
templateKey
themeKey
density
radiusStyle
buttonStyle
customTokenOverrides
draftConfig
publishedConfig
SchoolModuleConfig

id
schoolId
newsEnabled
teachersEnabled
scheduleEnabled
documentsEnabled
galleryEnabled
contactsEnabled
SchoolMenuItem

id
schoolId
key
title
type
url
pageId
isVisible
sortOrder
NewsPost

id
schoolId
title
slug
excerpt
content
category
coverImageUrl
status
publishedAt
authorUserId
DocumentItem

id
schoolId
title
category
fileUrl
fileName
fileSize
status
publishedAt
authorUserId
AuditLog

id
schoolId
userId
action
entityType
entityId
payload
createdAt 7. Структура шаблонов
Не хранить шаблон как HTML в БД.

Шаблон это preset-конфиг:

type TemplateKey =
| 'classic'
| 'modern'
| 'academic'
| 'media'
| 'compact'

interface TemplateDefinition {
key: TemplateKey
name: string
blocks: string[]
menuStyle: 'top' | 'split' | 'compact'
heroStyle: 'large' | 'centered' | 'minimal'
cardStyle: 'soft' | 'bordered' | 'flat'
}
5 шаблонов MVP

classic
modern
academic
media
compact 8. Структура тем
Тема это только токены:

interface ThemeTokens {
primary: string
primaryDark: string
accent: string
background: string
surface: string
surfaceAlt: string
border: string
textPrimary: string
textSecondary: string
textMuted: string
}
10 тем MVP

blue
navy
emerald
burgundy
teal
graphite
terracotta
sand
violet
slate 9. Что можно кастомизировать в MVP
Школа может:

выбрать шаблон
выбрать тему
выбрать стиль кнопок
выбрать радиусы
включать/выключать разделы
менять порядок меню
менять hero title / hero text
менять контакты
вести новости
вести документы
Школа не может:

писать свой CSS
создавать произвольные компоненты
ломать сетку шаблона
редактировать код 10. Admin UI модули
Dashboard

краткая статистика
быстрые действия
статус публикации
School Settings

название
краткое название
тип
контакты
логотип
hero-тексты
Design

выбор шаблона
выбор темы
preview
базовые настройки внешнего вида
Navigation

показать/скрыть системные разделы
порядок меню
название пунктов
News

список
создание
редактирование
публикация
Documents

список
загрузка
категории
публикация
Users

список пользователей школы
роли
приглашения 11. Состояния публикации
Для MVP достаточно:

draft
published
Для news, documents, designConfig, menuConfig:

редактирование идет в draft
есть кнопка Publish
публичный сайт читает published version 12. Preview
Нужно 2 режима:

Admin Form
Пользователь меняет настройки.

Live Preview
Справа или в отдельном route:

/admin/school/:slug/preview
Preview должен подхватывать:

draft template
draft theme
draft hero settings
draft menu visibility 13. Минимальная схема БД
Если SQL, то таблицы:

schools
users
user_school_roles
theme_presets
template_presets
school_design_configs
school_module_configs
school_menu_items
news_posts
document_items
audit_logs 14. API слои
Нужны группы endpoint’ов:

Auth:

POST /auth/login
POST /auth/logout
GET /auth/me
Schools:

GET /schools
GET /schools/:slug
PATCH /schools/:slug
Design:

GET /schools/:slug/design
PATCH /schools/:slug/design/draft
POST /schools/:slug/design/publish
GET /theme-presets
GET /template-presets
Navigation:

GET /schools/:slug/navigation
PATCH /schools/:slug/navigation
POST /schools/:slug/navigation/publish
News:

GET /schools/:slug/news
POST /schools/:slug/news
PATCH /schools/:slug/news/:id
POST /schools/:slug/news/:id/publish
Documents:

GET /schools/:slug/documents
POST /schools/:slug/documents
PATCH /schools/:slug/documents/:id
POST /schools/:slug/documents/:id/publish
Users:

GET /schools/:slug/users
POST /schools/:slug/users/invite
PATCH /schools/:slug/users/:id/role 15. Frontend state
На клиенте полезно выделить:

auth state
current school state
design draft state
navigation state
content lists 16. Реальный порядок разработки

Сделать data contracts и types.
Сделать auth scaffold.
Сделать admin layout.
Сделать school context selector.
Сделать school settings form.
Сделать template/theme presets.
Сделать design config storage.
Сделать preview route.
Сделать navigation editor.
Сделать news CRUD.
Сделать documents CRUD.
Сделать users/roles для школы. 17. Самый первый спринт
Если брать только Sprint 1:

admin routes
login mock
school selection
school settings page
template presets mock
theme presets mock
design preview mock 18. Что я бы делал следующим сообщением
Могу сразу подготовить одно из двух:

ER/model spec в виде TypeScript interfaces + relation map
Admin IA/UX map: какие экраны будут в админке и что на каждом экране
Логичнее сейчас сделать Admin IA/UX map, потому что вы отдельно акцентировали “наглядно и просто”.

Admin IA

Цель админки: пользователь заходит в свой кабинет, попадает в контекст школы и управляет сайтом без кода через простые формы, переключатели, превью и готовые пресеты.

1. Входной сценарий

Login
Экран: email, пароль, кнопка входа.

School Select
Нужен, если у пользователя больше одной школы.
Показывает карточки доступных школ.

School Admin Dashboard
Точка входа в админку конкретной школы.

2. Верхний уровень навигации
   Левое меню админки:

Дашборд
Сайт школы
Оформление
Структура
Контент
Пользователи
Настройки
В шапке:

текущая школа
роль пользователя
кнопка Предпросмотр
кнопка Опубликовать изменения
меню профиля 3. Экран Дашборда
Назначение: быстро понять состояние сайта.

Блоки:

Название школы
Активный шаблон
Активная тема
Последние изменения
Черновики
Быстрые действия
Действия:

Изменить оформление
Добавить новость
Загрузить документ
Открыть меню
Перейти в предпросмотр 4. Раздел “Сайт школы”
Это базовые данные школы.

Подразделы:

Общая информация
Контакты
Главный экран
Брендинг
Общая информация
Поля:

полное название
краткое название
тип школы
город
описание школы
Контакты
Поля:

адрес
телефон
email
часы работы
карта/координаты
Главный экран
Поля:

заголовок hero
подзаголовок
основные цифры
CTA-кнопки
Брендинг
Поля:

логотип
favicon
обложка/баннер 5. Раздел “Оформление”
Это самый важный UX-модуль.

Подразделы:

Шаблон
Цветовая тема
Тонкая настройка
Предпросмотр
Шаблон
Показываем 5 карточек шаблонов.
Каждая карточка:

название
мини-превью
краткое описание
кнопка Выбрать
UX:

не список в таблице, а визуальные карточки
при выборе справа сразу preview
Цветовая тема
Показываем 10 тем плитками.
Каждая тема:

palette preview
название
контрастная оценка
UX:

выбор в 1 клик
активная тема подсвечена
есть “сравнить до/после”
Тонкая настройка
Только простые настройки:

стиль кнопок
скругления
плотность интерфейса
акцентность карточек
Никакого CSS и сложных параметров в MVP.

Предпросмотр
Два режима:

desktop
mobile
Переключатели:

черновик / опубликовано
текущая страница / главная / новости / документы 6. Раздел “Структура”
Тут школа меняет не дизайн, а состав сайта.

Подразделы:

Разделы сайта
Меню
Главная страница
Разделы сайта
Список системных разделов:

Новости
Педагоги
Расписание
Документы
Галерея
Контакты
Для каждого:

toggle вкл/выкл
видимость в меню
название пункта
Меню
Функции:

reorder drag-and-drop
переименование пунктов
скрытие пунктов
Важно:

максимум простоты
без сложной вложенности в MVP
Главная страница
Список блоков:

hero
быстрые ссылки
новости
о школе
документы
контакты
Для каждого блока:

toggle
порядок
краткие настройки 7. Раздел “Контент”
Подразделы:

Новости
Документы
Страницы
Галерея
Новости
Список карточек/таблица:

заголовок
статус
дата
автор
Действия:

создать
редактировать
удалить
опубликовать
Экран редактирования новости:

title
excerpt
content
category
cover
preview
publish
Документы
Список:

название
категория
размер
статус
Действия:

загрузить файл
редактировать метаданные
опубликовать
удалить
Страницы
Для MVP можно оставить ограниченно:

“О школе”
“Родителям”
“Поступающим”
Не полноценный page builder, а редактируемые контентные страницы.

Галерея

список изображений
альбомы или категории
порядок
видимость 8. Раздел “Пользователи”
Подразделы:

Пользователи школы
Роли
Приглашения
Пользователи школы
Список:

имя
email
роль
статус
Действия:

пригласить
сменить роль
отключить доступ
Роли
В MVP это скорее read-only справочник:

school_admin
director
vice_principal
content_manager
teacher
editor
Приглашения

отправленные приглашения
статус
повторить
отменить 9. Раздел “Настройки”
Подразделы:

Публикация
История изменений
Служебные параметры
Публикация
Показывает:

что изменено
какие разделы имеют черновики
что будет опубликовано
История изменений
Для MVP достаточно:

кто
когда
что изменил
Служебные параметры
Только для продвинутых ролей:

slug школы
системные идентификаторы
возможно домен в будущем 10. UX-принципы админки

Не показывать всё сразу.
Сначала базовые настройки, потом расширенные.

Все визуальные решения через preview.
Шаблон и тема без preview бессмысленны.

Не использовать технические термины там, где можно человеческие.
Не theme token, а Основной цвет.

Важные действия с подтверждением.
Смена шаблона, публикация, отключение раздела.

У каждой формы должен быть clear outcome.

Сохранить черновик
Посмотреть предпросмотр
Опубликовать 11. MVP-экраны
Если очень приземленно, минимальный комплект экранов:

Login
School Select
Dashboard
School Settings
Template Select
Theme Select
Design Preview
Navigation Manager
News List
News Edit
Documents List
Users List 12. Что важно не делать в первой версии

свободный page builder
произвольные layout-конструкторы
вложенные меню любой глубины
произвольные темы с ручным вводом цветов
отдельные права на каждый крошечный action 13. Рекомендуемый следующий шаг
Теперь логично зафиксировать это в виде каркаса экранов:

какие страницы админки существуют
какие компоненты на каждой
какие данные они читают/сохраняю

Admin Screen Spec

Ниже каркас экранов админки в прикладном виде: страница, состав блоков, что читает, что сохраняет.

1. /admin/login
   Назначение: вход в систему.

Компоненты:

форма входа
поле email
поле password
кнопка Войти
блок ошибок
Читает:

ничего до submit
Сохраняет:

access token / session
профиль пользователя me 2. /admin/select-school
Назначение: выбор школы, если доступно несколько.

Компоненты:

список карточек школ
поиск по школам
бейдж роли пользователя в школе
кнопка Открыть кабинет
Читает:

список школ пользователя
роли пользователя по школам
Сохраняет:

текущую выбранную школу в session state 3. /admin/school/:slug/dashboard
Назначение: стартовый экран кабинета школы.

Компоненты:

header школы
карточка активного шаблона
карточка активной темы
карточка статуса публикации
блок последних изменений
блок быстрых действий
блок статистики контента
Читает:

school
schoolDesignConfig
schoolModuleConfig
последние news
последние documents
auditLogs
draft/published status
Сохраняет:

ничего напрямую
только переходы в другие разделы 4. /admin/school/:slug/settings/general
Назначение: базовые данные школы.

Компоненты:

форма общей информации
поля fullName, shortName, type, city
textarea description
кнопки Сохранить, Сбросить
Читает:

school
Сохраняет:

school.fullName
school.shortName
school.type
school.city
school.description 5. /admin/school/:slug/settings/contacts
Назначение: контакты школы.

Компоненты:

форма контактов
поля address, phone, email, hours
блок карты/координат
кнопки Сохранить
Читает:

school
Сохраняет:

school.address
school.phone
school.email
school.hours
опционально school.mapData 6. /admin/school/:slug/settings/branding
Назначение: логотип и базовый брендинг.

Компоненты:

upload логотипа
upload favicon
upload hero image / cover
preview загруженных файлов
кнопки удаления/замены
Читает:

school.logoUrl
school.faviconUrl
school.coverUrl
Сохраняет:

media assets
ссылки на assets в school 7. /admin/school/:slug/settings/homepage
Назначение: базовые тексты главной школы.

Компоненты:

поля heroTitle
поле heroText
редактор статистики
список CTA-кнопок
quick links editor
Читает:

school.heroTitle
school.heroText
school.stats
school.ctaConfig
school.quickLinksConfig
Сохраняет:

homepage config школы 8. /admin/school/:slug/design/templates
Назначение: выбор шаблона.

Компоненты:

grid из 5 template cards
мини-превью
описание шаблона
кнопка Выбрать
боковой live preview
compare current vs selected
Читает:

templatePresets
schoolDesignConfig.currentTemplate
schoolDesignConfig.draftTemplate
Сохраняет:

schoolDesignConfig.draftTemplate 9. /admin/school/:slug/design/themes
Назначение: выбор цветовой темы.

Компоненты:

grid из 10 theme cards
preview палитры
активная тема
live preview
фильтр/группа тем при необходимости
Читает:

themePresets
schoolDesignConfig.currentTheme
schoolDesignConfig.draftTheme
Сохраняет:

schoolDesignConfig.draftTheme 10. /admin/school/:slug/design/customize
Назначение: простая кастомизация без кода.

Компоненты:

selector buttonStyle
selector radiusStyle
selector density
selector cardStyle
toggle highContrast
live preview
Читает:

schoolDesignConfig.draftSettings
Сохраняет:

schoolDesignConfig.draftSettings
customTokenOverrides в ограниченном виде 11. /admin/school/:slug/design/preview
Назначение: предпросмотр черновика.

Компоненты:

iframe/preview canvas
переключатели desktop/mobile
переключатели главная/новости/документы/контакты
переключатель draft/published
кнопка Опубликовать
Читает:

draft config
published config
данные школы
активные разделы
контент
Сохраняет:

ничего, кроме action publish 12. /admin/school/:slug/structure/modules
Назначение: включение/отключение системных разделов.

Компоненты:

список системных модулей
toggle для каждого
краткое описание
предупреждение о скрытии раздела
Читает:

schoolModuleConfig
Сохраняет:

schoolModuleConfig.newsEnabled
teachersEnabled
scheduleEnabled
documentsEnabled
galleryEnabled
contactsEnabled 13. /admin/school/:slug/structure/navigation
Назначение: управление меню.

Компоненты:

drag-and-drop список пунктов
inline rename
toggle visible
preview desktop/mobile menu
Читает:

schoolMenuItems
schoolModuleConfig
Сохраняет:

порядок sortOrder
title
isVisible 14. /admin/school/:slug/structure/home-blocks
Назначение: структура главной страницы школы.

Компоненты:

список блоков главной
drag-and-drop
toggle block visibility
кнопка Настроить блок
live preview
Читает:

schoolHomepageBlocks
текущий template config
Сохраняет:

порядок блоков
видимость блоков
block-level settings 15. /admin/school/:slug/content/news
Назначение: список новостей школы.

Компоненты:

table/list news
фильтры status, category
поиск
кнопка Создать новость
bulk actions
Читает:

newsPosts школы
Сохраняет:

фильтры в local state
bulk status changes при необходимости 16. /admin/school/:slug/content/news/new
Назначение: создание новости.

Компоненты:

form title
slug
excerpt
rich text/block editor content
category
coverImage
кнопки Сохранить черновик, Опубликовать, Предпросмотр
Читает:

categories
media library
Сохраняет:

NewsPost 17. /admin/school/:slug/content/news/:id
Назначение: редактирование новости.

Компоненты:

тот же редактор
status badge
publish controls
history sidebar
Читает:

NewsPost by id
revisions при наличии
Сохраняет:

изменения NewsPost
status
publishedAt 18. /admin/school/:slug/content/documents
Назначение: список документов.

Компоненты:

table/list documents
фильтр по категориям
кнопка Загрузить документ
статус публикации
Читает:

DocumentItems
Сохраняет:

list filters
bulk actions при необходимости 19. /admin/school/:slug/content/documents/new
Назначение: загрузка документа.

Компоненты:

upload file
title
category
description optional
publish controls
Читает:

categories
Сохраняет:

DocumentItem
media/file asset 20. /admin/school/:slug/content/documents/:id
Назначение: редактирование документа.

Компоненты:

metadata form
file preview/info
replace file
publish controls
Читает:

DocumentItem
Сохраняет:

DocumentItem fields
new file if replaced 21. /admin/school/:slug/content/pages
Назначение: список статических страниц.

Компоненты:

список страниц
статусы
кнопка Создать страницу
Читает:

PageItems
Сохраняет:

список и сортировку при необходимости 22. /admin/school/:slug/content/pages/:id
Назначение: редактирование страницы.

Компоненты:

title
slug
content editor
seo block
publish controls
Читает:

PageItem
Сохраняет:

PageItem 23. /admin/school/:slug/content/gallery
Назначение: галерея школы.

Компоненты:

grid изображений
upload
фильтры по альбомам
reorder
visibility
Читает:

gallery assets
album list
Сохраняет:

image metadata
order
visibility
album assignment 24. /admin/school/:slug/users/list
Назначение: пользователи школы.

Компоненты:

table users
роль
статус
кнопка Пригласить
action menu сменить роль, отключить
Читает:

UserSchoolRole
User
Сохраняет:

role assignments
active/inactive state 25. /admin/school/:slug/users/invite
Назначение: приглашение нового пользователя.

Компоненты:

email
имя
роль
кнопка Отправить приглашение
Читает:

доступные роли
Сохраняет:

invitation record
new school role assignment pending 26. /admin/school/:slug/settings/publishing
Назначение: единая публикация изменений.

Компоненты:

список draft changes
diff summary
affected sections
кнопка Опубликовать все
кнопка Отменить черновики
Читает:

draft changes across modules
Сохраняет:

publish action
discard action 27. /admin/school/:slug/settings/history
Назначение: история изменений.

Компоненты:

timeline/log list
фильтр по сущности
фильтр по пользователю
карточка изменения
кнопка rollback для поддерживаемых сущностей
Читает:

AuditLog
revisions
Сохраняет:

rollback action 28. Глобальные компоненты админки
Используются почти везде:

AdminHeader
AdminSidebar
SchoolSwitcher
RoleBadge
SaveBar
PublishBar
PreviewPane
TemplateCard
ThemeCard
SortableList
StatusBadge
ConfirmDialog
FormSection
EmptyState 29. Общие состояния данных
Практически все экраны читают:

currentUser
currentSchool
currentRole
permissions
Многие экраны сохраняют:

draft config
published config
content items
audit entries 30. Как я бы сгруппировал backend contracts
school

general
contacts
branding
homepage
design

template
theme
customization
preview
publish
structure

modules
menu
home blocks
content

news
documents
pages
gallery
access

users
roles
invitations
system

audit
revisions
publish queue 31. Самые первые экраны для реализации
Если брать реалистичный старт разработки UI:

Login
School Select
Admin Dashboard
School Settings General
Design Templates
Design Themes
Navigation
News List
News Edit
Documents List
Если хотите, следующим сообщением я превращу это в таблицу сущностей и API-контрактов для MVP:

экран → endpoint’ы
экран → сущности
экран → create/read/update actions

Структуру админки создал как отдельный модуль в src/modules/admin, с layout, router-файлом, компонентами оболочки и набором страниц-заготовок.
Что появилось:
layout админки: src/modules/admin/layouts/AdminLayout.vue (line 1)
общие компоненты:AdminHeader.vue (line 1)
AdminSidebar.vue (line 1)
AdminPageStub.vue (line 1)

роуты админки: src/modules/admin/router/admin-routes.ts (line 1)
подключение в основной роутер: src/router/index.ts (line 1)
Страницы-заготовки созданы по разделам:
auth:LoginPage.vue (line 1)
SelectSchoolPage.vue (line 1)

dashboard:DashboardPage.vue (line 1)

settings:GeneralPage.vue (line 1)
ContactsPage.vue (line 1)
BrandingPage.vue (line 1)
HomepagePage.vue (line 1)

design:TemplatesPage.vue (line 1)
ThemesPage.vue (line 1)
CustomizePage.vue (line 1)
PreviewPage.vue (line 1)

structure:ModulesPage.vue (line 1)
NavigationPage.vue (line 1)
HomeBlocksPage.vue (line 1)

content:NewsListPage.vue (line 1)
NewsEditPage.vue (line 1)
DocumentsListPage.vue (line 1)
DocumentEditPage.vue (line 1)

users:UsersListPage.vue (line 1)
InviteUserPage.vue (line 1)

system:PublishingPage.vue (line 1)
HistoryPage.vue (line 1)

Маршруты уже есть в виде каркаса:
/admin/login
/admin/select-school
/admin/school/:slug/...
Сборка проходит: npm run build.
Логичный следующий шаг: начать не со всех страниц сразу, а с базы.
Я бы делал так:
подключить mock auth и guard’ы для /admin
оживить SelectSchoolPage
реализовать DashboardPage
затем GeneralPage и TemplatesPage
Если хотите, следующим сообщением я начну именно с admin auth scaffold + route guards + school selection mock.
