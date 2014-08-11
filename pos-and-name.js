//OwnerId','RA_hr','RA_min','RA_sec','DEC_deg','DEC_arcmin','DEC_arcsec','Distance','Name
var raData = [
['100','0','0','0','0','0','0','0','Sol'],
['200','14','39','35.88000107','-60','50','7.400000095','4.39502','Alpha and Proxima Centauri'],
['300','17','57','48.51499939','4','41','35.83000183','5.940689','Barnards Star'],
['600','6','45','8.87100029','-16','42','57.99000168','8.601128','Sirius'],
['1800','0','9','10.69499969','59','8','59.18000031','54.460378','Beta Cassiopeiae'],
['1900','0','9','24.6590004','-45','44','50.79000092','140.104325','Epsilon Phoenicis'],
['2000','0','11','15.86200047','-15','28','4.920000076','61.609989','6 Ceti'],
['2200','0','11','44.01399994','-35','7','59.16999817','71.137075','Theta Sculptoris'],
['3100','0','20','4.250999928','-64','52','29.25','28.025761','Zeta Tucanae'],
['3600','0','22','51.77999878','-12','12','33.90000153','66.496043','9 Ceti'],
['4000','0','25','45.05599976','-77','15','15.39999962','24.380607','Beta Hydri'],
['4100','0','26','12.18200016','-43','40','47.22999954','76.726219','Kappa Phoenicis'],
['4800','0','39','21.79999924','21','15','1.600000024','36.228309','54 Piscis'],
['5300','0','42','48.23799896','35','32','55.95999908','77.602483','FF Andromedae'],
['5500','0','43','35.37200165','-17','59','11.81999969','95.817664','Beta Ceti'],
['6100','0','45','28.69000053','-12','52','50.5','103.906594','18 Ceti'],
['6400','0','48','58.70500183','16','56','26.19000053','78.029473','64 Piscis'],
['6500','0','46','31','5','9','11','14.125749','van Maanens Star'],
['6700','0','50','7.596000195','-10','38','39.54000092','50.41941','Phi(2) Ceti'],
['9700','1','8','35.39599991','-10','10','56.16999817','117.620642','Eta Ceti'],
['9900','1','9','43.93099976','35','37','13.94999981','199.366318','Beta Andromedae'],
['10100','1','9','59','-17','16','23','12.197548','YZ Ceti'],
['10500','1','15','11.10200024','-45','31','53.86000061','49.098769','Nu Phoenicis'],
['12000','1','36','47.84199905','41','24','19.63999939','43.927721','Upsilon Andromedae'],
['13000','1','42','29.79000092','20','16','6.099999905','24.356924','107 Piscis'],
['13600','1','44','4.09100008','-15','56','14.89000034','11.896367','Tau Ceti'],
['14400','1','53','4.90500021','29','34','43.81999969','64.11707','Alpha Trianguli'],
['14700','1','54','38.40100098','20','48','28.81999969','59.584059','Beta Arietis'],
['15200','1','58','46.20100021','-61','34','11.43000031','71.308151','Alpha Hydri'],
['15700','2','7','10.40299988','23','27','44.65999985','65.918163','Alpha Arietis'],
['16200','2','12','48.0909996','21','12','39.45000076','98.271583','Eta Arietis'],
['16300','2','12','54.47999954','-30','43','25.79999924','332.141961','Mu Fornacis'],
['16900','2','17','3.230000019','34','13','27.60000038','35.375628','Delta Trianguli'],
['17600','2','22','32.56700134','-23','48','59.31999969','71.526992','Kappa Fornacis'],
['17700','2','21','44.94900131','-68','39','33.84999847','135.337784','Delta Hydri'],
['18200','2','32','54.11399841','15','2','4.539999962','93.617461','29 Arietis'],
['18600','2','34','22.58499908','-43','47','46.90000153','37.546152','CC Eridani'],
['19200','2','36','58.61700058','-34','34','40.79999924','83.289956','Lambda(2) Fornacis'],
['20000','2','42','14.9090004','40','11','38.02000046','80.494384','12 Persei'],
['20200','2','42','33.49900055','-50','48','1.320000052','56.23509','Iota Horologii'],
['20500','2','44','56.53699875','10','6','50.75999832','84.258153','Mu Ceti'],
['20600','2','45','6.21600008','-18','34','21.28000069','45.579023','Tau(1) Eridani'],
['21100','2','48','43.70299911','31','6','54.56000137','143.494864','VY Arietis'],
['21600','2','52','32.13499832','-12','46','11.07999992','33.858928','EP Eridani'],
['22200','3','1','37.65299988','-28','5','29.68000031','99.017442','Epsilon Fornacis'],
['22300','3','2','23.50699997','-23','37','27.98999977','86.172564','Tau(3) Eridani'],
['22900','3','9','4.015999794','49','36','47.88999939','34.358266','Iota Persei'],
['23900','3','17','46.11999893','-62','34','30.10000038','39.530113','Zeta(1) Reticuli'],
['24000','3','19','21.69599915','3','22','12.59000015','29.87392','Kappa Ceti'],
['24100','3','18','12.81000042','-62','30','23','39.39651','Zeta(2) Reticuli'],
['24200','3','19','55.66899872','-43','4','11.28999996','19.765056','82 Eridani'],
['25100','3','32','55.84600067','-9','27','29.71999931','10.495983','Epsilon Eridani'],
['25500','3','36','52.37599945','0','24','5.889999866','44.747326','10 Tauri'],
['26100','3','43','14.90299988','-9','45','48.25','29.495695','Delta Eridani'],
['26800','3','44','11.98200035','-64','48','25.06999969','99.713637','Beta Reticuli'],
['27000','3','46','50.88899994','-23','14','58.97000122','58.462673','Tau(6) Eridani'],
['27300','3','51','2.948999882','23','54','13.88000011','131.943247','vB 170 Hyades'],
['28900','4','5','20.22999954','22','0','30.10000038','54.551511','39 Tauri'],
['29300','4','8','36.6230011','38','2','23','69.588899','50 Persei'],
['30300','4','16','1.600999951','-51','29','11.93000031','66.212649','Gamma Doradus'],
['30400','4','16','28.93000031','-59','18','7.199999809','59.475438','Epsilon Reticuli'],
['32600','4','42','3.482000113','-37','8','39.68999863','90.200041','Beta Caeli'],
['33000','4','47','36.31399918','-16','56','3.900000095','43.430582','58 Eridani'],
['33200','4','49','50.41400146','6','57','40.54000092','26.176803','Pi(3) Orionis'],
['34700','5','2','48.68000031','-49','9','4.900000095','85.40542','Eta(1) Pictoris'],
['35100','5','5','30.64999962','-57','28','21.92000008','38.001122','Zeta Doradus'],
['35200','5','7','38.38000107','9','28','18.39999962','92.292922','13 Orionis'],
['35400','5','7','50.97200012','-5','5','11.22999954','88.848622','Beta Eridani'],
['35500','5','8','43.71300125','-4','27','22.27000046','81.56121','68 Eridani'],
['35800','5','11','40.59999847','-45','1','7.5','12.777727','Kapteyns Star'],
['36300','5','19','8.470000267','40','5','56.61000061','41.244768','Lambda Aurigae'],
['36900','5','24','25.43000031','17','23','1.299999952','47.831588','111 Tauri'],
['37800','5','31','9','1','54','47','49.195099','V371 Orionis'],
['38500','5','37','44.61999893','-28','41','23.12000084','138.557447','Nu(2) Columbae'],
['38600','5','38','53.11500168','-7','12','46.41999817','153.56056','49 Orionis'],
['39300','5','37','9.840999603','-80','28','8.670000076','59.388801','Pi Mensae'],
['39600','5','46','57.33200073','-14','49','19.12000084','70.187964','Zeta Leporis'],
['40000','5','47','17.0890007','-51','3','59.40000153','62.880867','Beta Pictoris'],
['40900','5','56','24.28800011','-14','10','3.869999886','49.06929','Eta Leporis'],
['41000','5','59','31.71999931','44','56','50.77999878','82.115608','Beta Aurigae'],
['42500','6','10','14.43599987','-74','45','11.05000019','33.099579','Alpha Mensae'],
['42600','6','14','50.84999847','19','9','22.60000038','68.912589','71 Orionis'],
['42700','6','16','26.61700058','12','16','19.70999908','63.953588','74 Orionis'],
['43100','6','36','41.02500153','-19','15','20.87999916','64.702145','Nu(2) Canis Majoris'],
['43500','6','45','17.36199951','12','53','44.02000046','57.201588','Xi Geminorum'],
['43700','6','46','44.33599854','43','34','38.77000046','53.857915','Psi(5) Aurigae'],
['44200','6','48','11.43700027','-61','56','28.95000076','98.957286','Alpha Pictoris'],
['44800','6','55','18.63699913','25','22','32.65000153','56.341912','37 Geminorum'],
['50400','7','10','1.756000042','38','31','46.47999954','20.742947','QY Aurigae'],
['50700','7','12','33.63800049','-46','45','33.83000183','69.073173','I Puppis'],
['51800','7','27','24.5','5','13','32.5','12.389409','Luytens Star'],
['52000','7','29','56','49','40','20.70000076','64.908096','22 Lyncis'],
['53400','7','44','40.1269989','3','33','8.659999847','19.34596','YZ Canis Minoris'],
['53600','7','45','18.94599915','28','1','34.25999832','33.715432','Pollux'],
['56100','8','9','0.66900003','-61','18','9','69.767569','B Carinae'],
['57300','8','20','3.855999947','27','13','3.640000105','59.119696','Chi Cancri'],
['57700','8','18','31.48900032','-76','55','10.60999966','63.455849','Alpha Chamaeleontis'],
['58100','8','24','35.01200104','-3','45','4.71999979','88.751892','1 Hydrae'],
['58400','8','25','44.19400024','-66','8','13.02000046','107.965648','Beta Volantis'],
['58600','8','26','53','26','57','12','11.826118','DX Cancri'],
['59200','8','39','11.73900032','65','1','15.25','46.548219','Pi(1) Ursae Majoris'],
['61400','8','59','42.72000122','-27','48','58.77999878','182.112839','TY Pyxidis'],
['61700','9','2','26.80400085','-66','23','45.99000168','124.299794','Alpha Volantis'],
['61900','9','8','52.25299835','51','36','16.72999954','95.593027','15 Ursae Majoris'],
['62200','9','8','47.3370018','26','37','44.81999969','101.989985','75 Cancri'],
['62800','9','14','20.55200005','61','25','24','63.803497','16 Ursae Minoris'],
['63000','9','16','11.31999969','54','1','18.71999931','118.389084','18 Ursae Majoris'],
['63100','9','15','45.09000015','-37','24','48.20000076','165.648787','K Velorum'],
['64600','9','31','31.7159996','63','3','42.70000076','75.500808','23 Ursae Majoris'],
['64800','9','32','25.54700089','-11','11','5.139999866','59.824485','LQ Hydrae'],
['64900','9','34','28.87400055','69','49','49.24000168','105.588373','24 Ursae Majoris'],
['66000','9','48','35.37900162','46','1','15.61999989','60.111177','15 Leonis Minoris'],
['66800','9','57','41.05199814','41','3','20.31999969','94.239609','19 Leonis Minoris'],
['67100','10','0','1.697999954','24','33','9.479999542','105.828199','DH Leonis'],
['67200','10','1','0.661000013','31','55','25.25','48.579545','20 Leonis Minoris'],
['67900','10','7','25.76600075','35','14','41.06999969','91.157946','21 Leonis Minoris'],
['69600','10','16','54','20','7','17','15.996191','AD Leonis'],
['69700','10','19','44.14199829','19','28','15.06999969','69.043894','40 Leonis'],
['70600','10','24','23.65999985','-74','1','53.81000137','52.888518','I Carinae'],
['71200','10','30','37.58499908','55','58','50.00999832','41.912484','36 Ursae Majoris'],
['73900','10','59','27.97200012','40','25','48.97999954','45.912581','47 Ursae Majoris'],
['74200','11','1','50.48199844','56','22','56.65000153','79.416467','Beta Ursae Majoris'],
['75400','11','11','39.49200058','-22','49','33.09999847','266.038933','Beta Crateris'],
['75800','11','14','6.494999886','20','31','25.29999924','57.707621','Delta Leonis'],
['76400','11','20','4.772999763','65','50','47.68999863','29.664672','SZ Ursae Majoris'],
['77900','11','34','21.95000076','3','3','36.34999847','86.630331','89 Leonis'],
['78600','11','41','3.019999981','34','12','5.789999962','31.119516','61 Ursae Majoris'],
['80300','11','49','3.579999924','14','34','19.35000038','36.176047','Denebola'],
['80400','11','50','41.72200012','1','45','52.86000061','35.552999','Beta Virginis'],
['81500','12','5','12.5369997','8','43','58.58000183','170.944944','Omicron Virginis'],
['81700','12','6','52.88399887','-64','36','49.47999954','64.217996','Eta Crucis'],
['81800','12','8','24.79999924','-24','43','44.02000046','48.170642','Alpha Corvi'],
['82900','12','13','25.9470005','10','15','44.20999908','161.626706','12 Virginis'],
['83100','12','15','25.55999947','57','1','57.41999817','81.438999','Delta Ursae Majoris'],
['85200','12','32','4.22300005','-16','11','45.63000107','59.388801','Eta Corvi'],
['85500','12','33','44.54499817','41','21','26.88999939','27.303186','Beta Canum Venaticorum'],
['86900','12','44','59.39300156','39','16','44.45999908','56.655085','10 Canum Venaticorum'],
['88500','12','53','11.1619997','-3','33','11.25','106.069025','38 Virginis'],
['89300','13','0','46.50500107','12','22','32.65000153','37.275849','DT Virginis'],
['89600','13','6','22.59499931','22','36','57.97000122','74.945611','40 Comae Berenices'],
['90100','13','10','36.89599991','35','56','5.659999847','352.609108','RS Canum Venaticorum'],
['90300','13','11','52.39500046','27','52','41.40000153','29.86023','Beta Comae Berenices'],
['91100','13','15','58.77899933','-19','56','34.83000183','127.010827','57 Virginis'],
['91200','13','16','46.50999832','9','25','26.60000038','58.546612','59 Virginis'],
['91400','13','18','24.31399918','-18','18','40.56999969','27.805921','61 Virginis'],
['91800','13','20','35.8219986','-36','42','44.31999969','58.620259','Iota Centauri'],
['92300','13','25','13.60999966','54','59','17','81.155305','Alcor'],
['92600','13','27','27.18899918','-15','58','24.62000084','258.244589','69 Virginis'],
['92700','13','28','25.80900002','13','46','43.5','59.066135','70 Virginis'],
['93600','13','34','43.25699997','-8','20','31.85000038','64.535666','EQ Virginis'],
['93700','13','34','41.58499908','0','35','45.38999939','73.212869','Zeta Virginis'],
['96000','13','54','41.07400131','18','23','51.72000122','36.992554','Eta Boötis'],
['96800','14','6','22.29999924','-26','40','56.52000046','101.387422','Pi Hydrae'],
['96900','14','6','40.95100021','-36','22','12.02999973','60.942274','Theta Centauri'],
['97200','14','10','23.93799973','25','5','29.88999939','119.605201','12 Boötis'],
['97500','14','12','46.0359993','-27','15','40.5','229.369544','50 Hydrae'],
['98100','14','15','39.67699814','19','10','56.70999908','36.70946','Arcturus'],
['98200','14','16','0.917999983','-6','0','2.039999962','69.782458','Iota Virginis'],
['98300','14','16','23.02000046','46','5','17.96999931','97.130212','Lambda Boötis'],
['98800','14','19','16.2859993','13','0','15.43000031','85.093447','18 Boötis'],
['101000','14','34','40.81999969','29','44','42.45999908','50.442793','Sigma Boötis'],
['101700','14','43','3.628999949','-5','39','29.55999947','60.91959','Mu Virginis'],
['101900','14','45','14.44699955','16','57','51.93999863','225.250533','Omicron Boötis'],
['102500','14','50','41.20700073','-15','59','50.13999939','77.18019','Alpha(1) Librae'],
['102700','14','50','52.71300125','-16','2','30.42000008','77.198376','Alpha(2) Librae'],
['103400','14','57','11.01200008','-4','20','47.15999985','91.030738','16 Librae'],
['104800','15','7','18.06900024','24','52','8.960000038','64.332014','45 Boötis'],
['105200','15','13','28.57500076','-25','18','34','83.674477','23 Librae'],
['105400','15','17','30.8390007','-58','48','4.480000019','96.640967','Beta Circini'],
['105900','15','21','48.15200043','-48','19','3.930000067','47.476446','Nu(2) Lupi'],
['106000','15','22','8.284999847','-47','55','40.38999939','111.432133','Nu(1) Lupi'],
['107300','15','35','31.57900047','-14','47','22.39999962','152.270496','Gamma Librae'],
['107800','15','44','16.08699989','6','25','32.31000137','73.229257','Alpha Serpentis'],
['108000','15','46','26.6079998','7','21','10.72000027','38.336079','Lambda Serpentis'],
['108300','15','50','48.97000122','4','28','39.84000015','70.308976','Epsilon Serpentis'],
['108600','15','53','12.10499954','13','11','47.90000153','56.951869','39 Serpentis'],
['108700','15','52','40.54199982','42','27','5.639999866','51.706276','Chi Herculis'],
['108900','15','55','47.5909996','37','56','49.20999908','135.224866','Lambda Coronae Borealis'],
['109000','15','56','27.18700027','15','39','41.88000107','36.272577','Gamma Serpentis'],
['109800','16','0','19.59799957','-16','32','0.109999999','106.973368','49 Librae'],
['109900','16','1','2.720000029','33','18','12.89999962','56.842649','Rho Coronae Borealis'],
['110100','16','1','53.33499908','58','33','54.95999908','68.249271','Theta Draconis'],
['110500','16','6','29.44099998','-45','10','23.63999939','123.500375','Delta Normae'],
['111300','16','10','24.34000015','43','49','3.809999943','59.18405','14 Herculis'],
['111700','16','15','37.29000092','-8','22','10.10000038','45.745202','18 Scorpii'],
['112000','16','18','19.29000092','-4','41','32.99000168','107.502984','Epsilon Ophiuchi'],
['112100','16','17','5.592000008','55','16','8.960000038','67.444855','CR Draconis'],
['112300','16','19','50.44300079','-50','9','19.97999954','127.507467','Gamma(2) Normae'],
['112700','16','22','4.354000092','1','1','44.52000046','89.213157','Sigma Serpentis'],
['113200','16','28','28.12299919','-70','5','3.980000019','39.482347','Zeta Trianguli Australis'],
['113600','16','33','27.04299927','-78','53','49.65999985','159.571198','Gamma Apodis'],
['114600','16','36','21.45499992','-2','19','28.60000038','31.892355','12 Ophiuchi'],
['116200','16','48','25.68099976','59','3','22.82999992','35.791026','DN Draconis'],
['117100','16','58','37.20800018','-55','59','24.51000023','78.043363','Zeta Arae'],
['117400','16','56','1.639999986','65','8','5.460000038','49.209888','19 Draconis'],
['117800','17','3','8.760000229','-53','14','12.80000019','85.900261','Epsilon(2) Arae'],
['119200','17','12','9.208999634','-43','14','20.98999977','71.589847','Eta Scorpii'],
['119700','17','15','1.911000013','24','50','21.17000008','78.499032','Delta Herculis'],
['120600','17','20','39.57099915','32','28','3.880000114','46.943433','72 Herculis'],
['121000','17','26','22.22200012','-24','10','31.12999916','83.717445','44 Ophiuchi'],
['121700','17','34','56.07600021','12','33','36.13999939','46.701508','Alpha Ophiuchi'],
['122000','17','38','5.554999828','-54','30','1.480000019','137.563169','Pi Arae'],
['122500','17','40','23.875','-49','24','56.08000183','71.339328','Lambda Arae'],
['122900','17','36','57.08200073','68','45','28.71999931','76.528263','Omega Draconis'],
['123100','17','44','8.704000473','-51','50','2.680000067','49.826341','Mu Arae'],
['123200','17','43','25.8029995','-21','40','59.50999832','57.221674','58 Ophiuchi'],
['125100','18','0','29.02099991','-3','41','25.17000008','75.658394','Zeta Serpentis'],
['125800','18','10','26.1970005','-62','0','8.720000267','57.912472','Iota Pavonis'],
['126400','18','13','53.80199814','64','23','50.18999863','76.636084','36 Draconis'],
['127300','18','21','18.60099983','-2','53','55.74000168','61.761679','Eta Serpentis'],
['127700','18','27','58.24599838','-25','25','18.14999962','77.28991','Lambda Sagittarii'],
['128500','18','33','17.76099968','22','18','51.22999954','76.438528','V774 Herculis'],
['128600','18','33','55.80799866','51','43','8.619999886','53.557233','BY Draconis'],
['128900','18','36','56.33200073','38','47','1.169999957','25.297741','Vega'],
['130000','18','45','39.72499847','20','32','46.72000122','62.280602','110 Herculis'],
['130500','18','49','40.13000107','-20','19','28.60000038','76.144741','29 Sagittarii'],
['131100','18','55','7.18200016','-22','40','17.09000015','270.226894','Nu(2) Sagittarii'],
['131200','18','55','27.42900085','8','24','8.819999695','37.807263','V1285 Aquilae'],
['131400','18','55','53.22100067','23','33','23.84000015','69.93205','V775 Herculis'],
['132100','19','4','41','-21','44','29.70000076','138.852234','Omicron Sagittarii'],
['132500','19','6','56.41500092','-27','40','13.56999969','120.399625','Tau Sagittarii'],
['133300','19','9','9.805000305','76','33','37.56000137','89.018398','59 Draconis'],
['134000','19','21','40.36800003','-17','50','49.75999832','121.748646','Rho(1) Sagittarii'],
['134600','19','24','58.20299911','11','56','39.83000183','49.411242','31 Aquilae'],
['134700','19','25','29.90399933','3','6','53.16999817','50.140413','Delta Aquilae'],
['135600','19','34','5.362999916','7','22','44.16999817','110.563763','Mu Aquilae'],
['135800','19','32','21.64999962','69','39','40.29999924','18.80875','Sigma Draconis'],
['136700','19','50','47.0019989','8','52','6.03000021','16.774527','Altair'],
['138400','20','4','6.21999979','17','4','13.10000038','57.62598','15 Sagittae'],
['138900','20','8','43.58100128','-66','10','55.45000076','19.920843','Delta Pavonis'],
['139600','20','12','25.90999985','-12','37','3.400000095','91.490404','Xi(2) Capricorni'],
['140900','20','27','21','9','31','11','28.560673','HU Delphini'],
['141500','20','37','34.04399872','-47','17','29.40999985','101.261513','Alpha Indi'],
['141600','20','40','2.622999907','-60','32','56.24000168','78.916829','Phi(2) Pavonis'],
['142600','20','44','2.34100008','-51','55','15.77999973','78.821498','Eta Indi'],
['142800','20','45','9.460000038','-31','20','26.29999924','32.425069','AU Microscopii'],
['143000','20','46','5.742000103','-25','16','15.27999973','47.852573','Psi Capricorni'],
['143300','20','45','17.37899971','61','50','19.64999962','46.775155','Eta Cephei'],
['143400','20','48','29.15999985','-43','59','18.63999939','133.947793','Iota Microscopii'],
['143900','20','52','7.646999836','27','5','49.27999878','216.575829','31 Vulpeculae'],
['145400','21','8','33.63100052','-21','11','37.24000168','191.186254','Chi Capricorni'],
['146300','21','17','15.2670002','-38','52','2.940000057','12.872958','AX Microscopii'],
['146800','21','18','34.76900101','62','35','8.079999924','48.797587','Alpha Cephei'],
['147400','21','26','26.59600067','-65','21','58.43000031','30.061084','Gamma Pavonis'],
['148800','21','41','28.54800034','-77','23','24.18000031','69.073173','Nu Octantis'],
['149100','21','40','5.456999779','-16','39','44.40000153','138.911191','Gamma Capricorni'],
['149500','21','44','31.33600044','14','46','18.79999924','59.989565','HN Pegasi'],
['149700','21','47','2.447999954','-16','7','38.27000046','38.562715','Delta Capricorni'],
['149800','21','49','5.952000141','-72','6','9.470000267','52.607023','AY Indi'],
['150700','21','52','29.9279995','28','47','36.65000153','90.225023','15 pegasi'],
['150800','21','53','17.77799988','-13','33','6.440000057','90.225023','Mu Capricorni'],
['151800','22','3','21.64299965','-56','47','9.579999924','11.827816','Epsilon Indi'],
['152200','22','7','0.672999978','25','20','42.31999969','38.345073','Iota Pegasi'],
['152300','22','8','14','-46','57','39.59000015','101.419399','Alpha Gruis'],
['152600','22','10','8.777000427','-32','32','54.04999924','61.125041','Tau Piscis Austrini'],
['152800','22','10','11.98700047','6','11','52.25999832','96.583708','Theta Pegasi'],
['153700','22','15','2.140000105','57','2','36.70000076','83.932889','Epsilon Cephei'],
['154000','22','21','39.37799835','-1','23','14.43999958','157.795486','Gamma Aquarii'],
['154800','22','34','41.64300156','-20','42','29.54999924','74.178568','Upsilon Aquarii'],
['155600','22','46','31.88299942','23','33','56.34999847','394.870439','Lambda Pegasi'],
['155800','22','46','49.18000031','44','20','0.100000001','16.46705','EV Lacertae'],
['155900','22','48','33.30099869','-51','19','0.74000001','129.635922','Epsilon Gruis'],
['156200','22','50','0.201000005','24','36','5.710000038','116.695313','Mu Pegasi'],
['156600','22','51','53.52999878','31','45','15.27999973','46.39593','GT Pegasi'],
['156900','22','53','37.99399948','-48','35','54.04000092','108.576205','Tau(1) Gruis'],
['157200','22','56','24.04800034','-31','33','56','24.909323','TW Piscis Austrini'],
['157400','22','57','39.05500031','-29','37','20.10000038','25.074103','Fomalhaut'],
['157500','22','57','27.96500015','20','46','7.099999905','50.101841','51 Pegasi'],
['157900','23','3','29.81800079','-34','44','58.04000092','93.242833','Pi Piscis Austrini'],
['159000','23','12','32.94300079','49','24','22.60000038','79.902814','7 Andromedae'],
['159900','23','17','25.7670002','-58','14','8.619999886','71.842163','Gamma Tucanae'],
['160200','23','18','9.93900013','-40','49','27.75','112.898069','Phi Gruis'],
['160300','23','15','1','6','7','17','66.563894','Viln 82 no 35'],
['160600','23','18','49.44100189','-32','31','55.16999817','178.817231','Gamma Sculptoris'],
['161000','23','23','4.892000198','-10','45','51.06999969','63.492923','Viln 82 no 55'],
['161500','23','26','16','4','58','30','44.864242','ZZ Piscis'],
['162000','23','31','31.51499939','-4','5','14.93000031','85.58469','Viln 82 no 70'],
['163000','23','37','33.85400009','46','27','29.43000031','84.1929','Lambda Andromedae'],
['163700','23','39','20.8239994','77','37','56.79999924','44.988052','Gamma Cephei'],
['163800','23','39','57.04100037','5','37','34.56000137','44.981856','Iota Piscis'],
['165100','23','55','4.053999901','28','38','1.220000029','138.087788','II Pegasi'],
['166900','0','32','30.06999969','67','14','7.599999905','33.032528','V547 Cassiopeiae'],
['167000','0','32','43.83399963','-63','1','52.47999954','151.563009','Beta(3) Tucanae'],
['167100','0','35','14.87300014','-3','35','34.22000122','68.651479','13 Ceti'],
['167800','0','49','5.797999859','57','48','58.43999863','19.41561','Eta Cassiopeiae'],
['168300','1','8','16.37800026','54','55','13.40999985','24.634722','Mu Cassiopeiae'],
['168600','1','14','24.04999924','-7','55','22.5','79.532582','37 Ceti'],
['168800','1','15','46.09999847','-68','52','33.29999924','66.645535','Kappa Tucanae'],
['169600','1','39','47.79999924','-56','11','41','26.571317','P Eridani'],
['169700','1','49','35.10599899','-10','41','11.09000015','77.016109','Chi Ceti'],
['169900','1','55','57.48799896','-51','36','31.98999977','57.031512','Chi Eridani'],
['170700','2','12','47.5','-2','23','37','150.235972','66 Ceti'],
['171700','2','39','33.83599854','-11','52','19.73999977','88.17611','Epsilon Ceti'],
['171800','2','43','18.04400063','3','14','8.600000381','81.991798','Gamma Ceti'],
['171900','2','44','11.98600006','49','13','42.47999954','36.635213','Theta Persei'],
['173200','3','12','4.287000179','-28','59','13.35999966','46.029296','Alpha Fornacis'],
['173400','3','12','46.43899918','-1','11','45.88000107','72.983535','94 Ceti'],
['174500','3','29','22.6779995','-62','56','15.09000015','69.91706','Kappa Reticuli'],
['175600','4','15','16.31399918','-7','39','9.880000114','16.45296','Omicron(2) Eridani'],
['176100','4','35','55.23699951','16','30','33.38999939','65.115445','Aldebaran'],
['176300','4','38','10.80900002','-14','18','14.13000011','109.303677','53 Eridani'],
['176600','4','40','33.70800018','-41','51','49.72999954','65.666045','Alpha Caeli'],
['177200','5','6','40.66199875','51','35','51.66999817','85.517339','9 Aurigae'],
['177300','5','7','27.01199913','18','38','42.43000031','51.75554','104 Tauri'],
['177500','5','16','41.35300064','45','59','52.90000153','42.199975','Capella and Capella H'],
['178300','5','37','21','24','46','53','33.729422','Riepes Double'],
['178400','5','44','27.7840004','-22','26','54.31000137','29.254969','Gamma Leporis'],
['178500','5','54','22.94099998','20','16','34.31000137','28.256394','Chi(1) Orionis'],
['179500','6','29','23.37999916','-2','48','50.79999924','13.472223','V577 Monoceri'],
['180200','6','54','38.61500168','13','10','40.18999863','91.132564','38 Geminorum'],
['180900','7','18','5.572000027','16','32','25.30999947','94.29407','Lambda Geminorum'],
['181100','7','20','7.367000103','21','58','56.29000092','58.821113','Delta Geminorum'],
['181200','7','29','6.699999809','31','47','3.869999886','60.333615','Rho Geminorum'],
['181400','7','31','57.11000061','36','13','8.100000381','39.296782','VV Lyncis'],
['181700','7','34','36','31','53','18','51.550989','Castor'],
['181900','7','39','18.11300087','5','13','30.05999947','11.407122','Procyon'],
['182500','7','51','46.29399872','-13','53','52.84999847','54.378637','9 Puppis'],
['183500','8','10','39.82400131','-13','47','57.09999847','73.344573','18 Puppis'],
['183900','8','31','37.56700134','19','23','39.34000015','41.788674','CU Cancri'],
['184600','8','44','42.22399902','-54','42','30.12000084','79.746527','Delta Velorum'],
['184800','8','52','35.83200073','28','19','51.15999985','40.872638','Rho(1) Cancri'],
['185200','8','59','12.44200039','48','2','30.09000015','47.740554','Iota Ursae Majoris'],
['185300','9','0','38.38999939','41','46','57.97999954','53.592407','10 Ursae Majoris'],
['185600','9','10','23.32799911','67','8','2.039999962','66.740965','Sigma(2) Ursae Majoris'],
['185900','9','12','17.52599907','14','59','45.29000092','66.795726','Pi(1) Cancri'],
['186900','9','29','8.909999847','-2','46','8.399999619','55.773525','Tau(1) Hydrae'],
['187100','9','30','42.01800156','-40','28','0.25','60.523877','Psi Velorum'],
['187300','9','32','51.41199875','51','40','38.38000107','43.986978','Theta Ursae Majoris'],
['187500','9','35','39.48099899','35','48','36.77999878','36.463238','11 Leonis Minoris'],
['187600','9','44','12.10999966','-27','46','10.30000019','62.723681','Theta Antliae'],
['188300','10','17','14.5340004','23','6','22.05999947','74.111217','39 Leonis'],
['189600','11','5','19.91799927','-27','17','36.95999908','141.933997','Chi(1) Hydrae'],
['189702','11','3','2','43','46','42','','WX Ursae Majoris'],
['190500','11','18','11','31','31','45','33.975344','Xi Ursae Majoris'],
['190600','11','21','26.72999954','-20','27','15','42.916255','SZ Crateris'],
['191100','11','26','45.32799911','3','0','47.04999924','57.636173','83 Leonis'],
['191200','11','31','44.95000076','14','21','52.70000076','75.118186','88 Leonis'],
['191600','11','38','40.00699997','-13','12','7.070000172','88.009531','Iota Crateris'],
['194400','12','41','39.59500122','-1','26','57.88000107','38.585498','Porrima'],
['195400','13','9','59.31700134','17','31','46.29000092','63.087717','Alpha Comae Berenices'],
['196100','13','23','55.53900146','54','55','31.37999916','78.160378','Mizar'],
['197100','13','47','15.73999977','17','27','24.43000031','50.867685','Tau Boötis'],
['198200','14','16','9.921999931','51','22','2.170000076','97.246028','Iota Boötis'],
['198600','14','25','11.79199982','51','51','2.769999981','47.524911','Theta Boötis'],
['198800','14','28','12.14400005','-2','13','40.66999817','135.056988','Phi Virginis'],
['199000','14','42','30.40800095','-64','58','30.51000023','53.495678','Alpha Circini'],
['199300','14','46','0.090000004','-25','26','34.90000153','99.258467','54 Hydrae'],
['199600','14','51','23.28100014','19','6','4.159999847','21.852042','Xi Boötis'],
['199800','14','54','29.28300095','16','6','4.110000134','32.005074','CE Boötis'],
['200200','15','3','47.5340004','47','39','15.14999962','41.607805','i Boötis'],
['200400','15','12','17.1060009','-52','5','57.38000107','116.237645','Zeta Lupi'],
['200900','15','23','12.34700012','30','17','16.23999977','60.738022','Eta Coronae Borealis'],
['201000','15','24','29.43400002','37','22','37.79000092','120.980203','Mu Boötis'],
['201600','15','44','1.807999969','2','30','54.47999954','47.852573','Psi Serpentis'],
['201800','15','55','8.546999931','-63','25','50.36999893','40.148164','Beta Trianguli Australis'],
['202200','16','4','22.10000038','-11','22','23','92.5957','Xi Scorpii'],
['202700','16','14','41.16999817','33','51','31.60000038','70.735866','Sigma Coronae Borealis'],
['203100','16','17','30.32299995','75','45','18.94000053','97.304085','Eta Ursae Minoris'],
['203300','16','23','59.45500183','61','30','51.93999863','87.725437','Eta Draconis'],
['203800','16','41','17.21299934','31','36','10.68999958','35.211447','Zeta Herculis'],
['204300','17','5','19.70000076','54','28','13','87.962065','Mu Draconis'],
['204400','17','10','22.68600082','-15','43','29.60000038','84.127748','Eta Ophiuchi'],
['204800','17','15','20.79999924','-26','36','5','19.465474','36 Ophiuchi'],
['205200','17','19','54.23199844','26','30','3.670000076','34.95853','V645 Herculis'],
['205300','17','21','0.233999997','-21','6','46.25999832','56.74382','Xi Ophiuchi'],
['206000','17','34','59.48500061','61','52','29.84000015','45.951453','26 Draconis'],
['206500','17','41','56.34199905','72','8','55.88999939','71.87384','Psi(1) Draconis'],
['206600','17','46','27.5170002','27','43','14.35000038','27.397218','Mu Herculis'],
['206800','18','3','4.960000038','-8','10','49.36000061','55.9457','Tau Ophiuchi'],
['206900','18','5','27.25','2','29','58.22000122','16.588462','70 Ophiuchi'],
['207000','18','7','20.98800087','9','33','49.86999893','82.782524','72 Ophiuchi'],
['207100','18','7','1.582000017','30','33','43.27999878','51.058746','99 Herculis'],
['207300','18','21','3.381000042','72','43','58.33000183','26.280228','Chi Draconis'],
['208400','19','6','25.16799927','-37','3','48.36000061','58.358049','Gamma Coronae Australis'],
['208500','19','5','24.61100006','13','51','48.43000031','83.247387','Zeta Aquilae'],
['209700','19','36','26.49600029','50','13','15.80000019','60.647687','Theta Cygni'],
['209900','19','41','48.90999985','50','31','30.39999962','70.521822','16 Cygni'],
['210300','19','46','25.61000061','33','43','39.59999847','68.035726','17 Cygni'],
['210400','19','51','1.610000014','10','24','57.20000076','63.246701','Omicron Aquilae'],
['210500','19','52','16','44','17','30','15.385035','V1581 Cygni'],
['210600','19','55','18.79899979','6','24','24.29000092','44.710553','Beta Aquilae'],
['211500','20','28','51.5929985','-17','48','49.54999924','98.71766','Rho Capricorni'],
['212400','20','46','12.68400002','33','58','12.92000008','72.064402','Epsilon Cygni'],
['212700','21','0','5.679999828','40','4','13.89999962','49.26195','V1396 Cygni'],
['213000','21','4','24.29500008','-19','51','18.12999916','158.025319','Eta Capricorni'],
['213300','21','6','54.59199905','38','44','44.99000168','11.427507','61 Cygni'],
['213500','21','14','28.77400017','10','0','24.89999962','60.277856','Delta Equulei'],
['213600','21','14','47.48600006','38','2','43.99000168','68.234981','Tau Cygni'],
['214000','21','19','51.91999817','-53','26','58','97.130212','Theta Indi'],
['214700','21','44','8.319999695','28','44','35.29999924','73.065276','Mu Cygni'],
['216100','22','24','37.40599823','-72','15','20.79000092','94.26689','Nu Indi'],
['216500','22','26','34.40000153','-16','44','33','65.49467','53 Aquarii'],
['216600','22','26','37.42499924','4','23','37.70999908','128.714591','34 Pegasi'],
['217100','22','35','45','-15','35','36','11.082657','EZ Aquarii'],
['217200','22','38','45.61000061','-20','37','14.30000019','28.188044','FK Aquarii'],
['217600','22','46','41.59999847','12','10','22','53.000237','Xi Pegasi'],
['217700','22','52','31.55800056','-32','52','31.79999924','222.33365','Gamma Piscis Austrini'],
['217800','22','52','24.07799911','9','50','8.43999958','87.560656','Sigma Pegasi'],
['218100','23','2','36.32500076','42','45','28.72999954','349.585302','2 Andromedae'],
['218300','23','9','54.90399933','-22','27','27.64999962','155.316285','89 Aquarii'],
['218400','23','9','57.43000031','47','57','30.60000038','82.447767','KZ Andromedae'],
['218600','23','15','53.50299835','-9','5','15.85000038','148.458262','Psi(1) Aquarii'],
['218900','23','19','6.690000057','-13','27','32','67.640712','94 Aquarii'],
['219100','23','31','52.24000168','19','56','15','20.377612','EQ Pegasi'],
['219500','23','42','43.34899902','-14','32','41.63999939','154.141138','Omega(2) Aquarii'],
['220200','0','2','10.29300022','27','4','55.13999939','40.451844','85 Pegasi'],
['220400','10','8','22.31500053','11','58','1.889999986','77.491863','Regulus'],
['220500','3','8','10.13099957','40','57','20.43000031','92.818241','Algol'],
['220600','1','37','42.85200119','-57','14','12.18000031','143.810635','Achernar'],
['220700','6','23','57.11899948','-52','41','44.5','110','Canopus'],
['220800','16','29','24.43899918','-26','25','55.15000153','603.561989','Antares'],
['220900','13','25','11.58699989','-11','9','40.70999908','262.188727','Spica'],
['221000','2','31','48.70399857','89','15','50.72000122','431.432905','Polaris'],
['221100','5','25','7.856999874','6','20','58.74000168','243.042622','Bellatrix'],
['221200','5','55','10.36999989','7','24','25.35000038','427.474777','Betelgeuse'],
['221300','5','14','33.26800156','-8','12','5.980000019','732.928107','Rigel'],
['221400','20','41','25.91699982','45','16','49.31000137','1600','Deneb'],
['221500','5','1','58.13299942','43','49','23.82999992','2038.520625','Epsilon Aurigae'],
['221600','19','58','21.70000076','35','12','5.820000172','7200','Cygnus X-1'],
['221600','19','58','21.70000076','35','12','5.820000172','7200','V1357 Cygni'],
['222600','12','56','1','38','19','0','110','Cor Caroli'],
['222800','15','19','18.79000092','1','45','55.56000137','80.672','5 Serpentis'],
['222900','3','24','19.36499977','49','51','40.34000015','592','Alpha Persei'],
['223000','6','58','37.54800034','-28','58','19.5','431','Epsilon Canis Majoris'],
['223100','9','27','35.24700165','-8','39','31.14999962','177','Alpha Hydrae'],
['223200','19','30','43.30099869','27','57','34.83000183','386','Beta Cygni'],
['223300','15','34','48.11000061','10','32','17.89999962','210','Delta Serpentis'],
['223400','11','3','43.66600037','61','45','3.220000029','123.7','Alpha Ursae Majoris'],
['223500','21','44','11.16399956','9','52','29.92000008','673','Epsilon Pegasi'],
['223600','17','56','36.36700058','51','29','20.20999908','147.7','Gamma Draconis'],
['223900','2','53','0.5','16','52','58','12.4','Teegardens Star'],
['224400','5','28','44.82799911','-65','26','54.85300064','48.774656','AB Doradus'],
['224500','4','7','34.37400055','38','4','28.62999916','67.1743','V491 Persei'],
['224700','16','50','9.819999695','-34','17','35.72000122','65.48','Wei']
];

var xyzData = [

['Eranin','','-22.85','36.60','-1.20',''],
['Asellus Primus','','-23.95','40.90','-1.34',''],
['LP 98-132','','-26.68','37.00','-4.59',''],
['I Bootis','','-22.38','34.90','4.00',''],
['Dahan','','-19.76','41.80','-3.19',''],
['Styx','','-24.31','37.74','6.04',''],
['LHS 3006','','-21.96','29.05','-1.71',''],
['Morgor','','-15.25','40.48','-2.25',''],
['Aulin','','-19.69','32.33','4.24',''],
['BD+47 2112','','-14.79','33.43','-0.41',''],
['Opala','','-25.50','35.26','9.29',''],
['LHS 2884','','-22.00','48.38','1.81',''],
['Nang Ta-Khian','','-18.21','26.50','-6.33',''],
['Acihaut','','-18.52','25.30','-4.00',''],
['Wyrd','','-11.64','31.55','-3.93',''],
['GD 319','','-19.37','43.63','-12.74',''],
['Meliae','','-17.32','49.54','-1.69',''],
['Rakapila','','-14.92','33.64','9.12',''],
['LHS 2819','','-30.51','38.55','-13.57',''],
['CM Draco','','-35.70','30.94','2.16',''],
['Aulis','','-16.48','44.17','-11.43',''],
['Ross 1051','','-37.21','44.49','-5.06',''],
['Lalande 29917','','-26.30','22.15','-4.56',''],
['DN Draconis','','-27.10','21.62','0.79',''],
['Bolg','','-7.90','34.71','2.12',''],
['LP 64-194','','-21.55','32.21','-16.21',''],
['Naraka','','-34.10','26.20','-5.52',''],
['Chi Herculis','','-30.75','39.71','12.77',''],
['DP Draconis','','-17.50','25.96','-11.36',''],
['LP 271-25','','-10.48','31.85','7.32',''],
['LFT 992','','-7.57','42.58','0.69',''],
['Ovid','','-28.06','35.14','14.82',''],
['Surya','','-38.48','39.24','5.42',''],
['LHS 5287','','-36.40','48.17','-0.79',''],
['Keries','','-18.92','27.21','12.60',''],
['LFT 880','','-22.81','31.40','-18.33',''],
['BD+55 1519','','-16.94','44.71','-16.58',''],
['Ross 1057','','-32.32','26.18','-12.43',''],
['H Draconis','','-39.85','29.55','-3.90',''],
['Ori','','-26.30','56.10','2.44',''],
['Pi-Fang','','-34.67','22.83','-4.40',''],
['LHS 6309','','-33.57','33.13','13.47',''],
['Aganippe','','-11.57','43.81','11.64',''],
['Ithaca','','-8.10','44.94','-9.27',''],
['Tilian','','-21.54','22.31','10.13',''],
['LHS 3262','','-24.12','18.85','4.92',''],
['Ross 1015','','-6.10','29.46','3.02',''],
['Magec','','-32.88','36.12','15.50',''],
['26 Draconis','','-39.00','24.92','-0.65',''],
['LFT 1361','','-38.79','24.72','-0.49',''],
['Hermitage','','-28.75','25.00','10.45',''],
['LHS 417','','-18.31','18.19','4.91',''],
['Wise 1647+5632','','-21.60','17.71','1.75',''],
['LP 275-68','','-23.35','25.06','15.20',''],
['LHS 2887','','-7.30','26.80','5.70','']

];