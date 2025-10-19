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
    created_at timestamp default current_timestamp
);

create table tipografia (
    id_tipografia serial primary key,
    nombre varchar(100) not null,
    tamanio_titulo int not null,
    tamanio_subtitulo int not null,
    tamanio_parrafo int not null,
    font1 varchar(100) not null,
    font2 varchar(100) not null,
    created_at timestamp default current_timestamp
);


