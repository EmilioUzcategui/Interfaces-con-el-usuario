create table users (
    id_user serial primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(255) not null,
    created_at timestamp default current_timestamp
);

create table colors (
    id_color serial primary key,
    name varchar(100) not null,
    color1 varchar(7) not null,
    color2 varchar(7) not null,
    color3 varchar(7) not null,
    color4 varchar(7) not null,
    color5 varchar(7) not null,
    created_at timestamp default current_timestamp,
    active boolean default false
);

create table tipografia (
    id_tipografia serial primary key,
    nombre varchar(100) not null,
    tamanio_titulo int not null,
    tamanio_subtitulo int not null,
    tamanio_parrafo int not null,
    font1 varchar(100) not null,
    font2 varchar(100) not null,
    created_at timestamp default current_timestamp,
    active boolean default false
);

-- establecer el active en true

update tipografia set active = true where id_tipografia = 1;

-- Tabla de CVs
create table cvs (
    id_cv serial primary key,
    user_id integer not null references users(id_user) on delete cascade,
    file_path varchar(255) not null,
    uploaded_at timestamp default current_timestamp
);
