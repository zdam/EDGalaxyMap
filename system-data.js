var sysData = [
['Aulin','Aulin Enterprise','-19.5','32.5','4.72','http://www.stellar-database.com/Scripts/search_star.exe?ID=104100'],
['BD+47 2112','Olivas Settlement','-14.8','33.5','-0.11','http://www.stellar-database.com/Scripts/search_star.exe?ID=197900'],
['Bolg','Moxons Mojo','-7.86','34.6','2.13','http://www.stellar-database.com/Scripts/search_star.exe?ID=94100'],
['Chi Herculis','Gorbatko Reserve','-39.63','12.77','30.67',''],
['DN Draconis','-','-22.3','0.82','28',''],
['Eranin','Azeban City','-23.18','37.12','-1.191','http://www.stellar-database.com/Scripts/search_star.exe?ID=100900'],
['h Draconis','Brislington','-39.39','29.24','-3.845','http://www.stellar-database.com/Scripts/search_star.exe?ID=117400'],
['i Bootis','Chango Dock','-22.4','34.9','4.02','http://www.stellar-database.com/Scripts/search_star.exe?ID=200200'],
['LFT 1361','-','-38.8','24.7','-0.49',''],
['LFT 992','Szulkin Mines','-749','42.3','0.71','http://www.stellar-database.com/Scripts/search_star.exe?ID=195700'],
['LP 271-25','-','-31.9','7.34','10.5','http://www.stellar-database.com/Scripts/search_star.exe?ID=99700'],
['Opala','Romanenko Estate','-25.5','35.3','9.29','http://www.stellar-database.com/Scripts/search_star.exe?ID=201400'],
['Wyrd','Vonarburg Co-Operative','-11.6','31.5','-3.91','http://www.stellar-database.com/Scripts/search_star.exe?ID=195800'],
['Wolf 359','3.902','6.478','-1.896',''],
['Wolf 1061','-0.829','5.451','12.77',''],
['Procyon','','6.22','2.674','-9.179',''],
];


/*
Wyrd
above is in galactic coords

web says:
Galactic (X,Y,Z) coordinates in ly: -3.91, 11.6, 31.5 

elite above says:
'-11.6','31.5','-3.91'

so order is diff (Y,Z,X), and Y is flipped pos to neg

var raData = [
['999','13','19','45','47','46','40','33.8','WyrdAdam'],

generates:



Distance from SOL
 33.8

Right Ascension and Declination: 13h19m45.657s, +47°46'40.47" (epoch 2000.0) 
RA
13 19 45

DEC
+47 46

Galactic:
Long
199

Lat
47

x = D.Cos(Lat).Sin(Long)
y = D.Cos(Lat).Cos(Long)
z = D.Sin(Lat)


Cos(Lat) = .681
Cos(Long) = -0.94
Sin(Lat) = .731
Sin(Long) = -0.32

x = 33.8 * .681 * -0.32 == -7.36
y = 33.8 * .681 * -0.94 == -21.63
z = 33.8 * .731			== 24.7





elite:
sol is at 0,0,0


concrete example of wyrd:
http://www.stellar-database.com/Scripts/search_star.exe?ID=195800


calculators I have tried:

http://ned.ipac.caltech.edu/forms/calculator.html
http://lambda.gsfc.nasa.gov/toolbox/tb_coordconv.cfm
http://www.robertmartinayers.org/tools/coordinates.html

the formula:
http://terraformers.info/files/galactic.pdf





export:

Positions
ProperNames




*/