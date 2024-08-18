let someNotes =[
  ".... .... ++3c............-1b+3c..2C3c...-gF.....A+C-A..F...1feF..+c-c..",
  "1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b1c2D2g1b 4FACFF3ACFFAC2FFACFF1ACFFACFFACF1c2D2g1b1c2D2g1b",
  "+  1b..+C 3D.1F. 3g,1ec 4d..1F  -a+d-ad d+d-a-a+ 1a5F1e3d  5g..1a b.ag b.fg  5d1gab  g5d1Dd 5c1fga  f5g1-ag 5b+1DGa 2b..1C - b...",
  "9c.2D. 9g.2c.  9c.2D. 9g.2c. /b -9c.2D. 9g.2c.9c.2D. 9g.2c.",  
  "+ c6d7u :3 3fuf:1  6d7c, :33ufu:1 5d..2:4udud:1 1c ,,,,      u6f7g :3 3afa:1  6g7f, :33guf:1 5g..2:4aw+c-w+:1 1c ..-Aa.g... :2fu.d.c:1 c..",
  
  " + 3cDgc -gA+d-g 2 +cDgc 1 -gA+d-g 4 +dFad 5 -Fa+d-g 8+dFad  4-Fa+2d- g Ff1eDdCc cDgc -gA+d-g 2 +cDgc 1 -gA+d-g 4 +dFad 5 -Fa+d-g 8+dFad  4-Fa+2d- ",
  
  "  5c,2u, ,,3c,  1:2cf:1,,,   5c,2u, ,,3d,  1:2c.:1,,1:2-wg+:1   5c,2u, ,,3c,  1:2cf:1,,,   5c,2u, ,,3d,  1:2c.:1,,1:2-wg+:1 ",
  
  " +/c 2c3e1g:2eg:1  2c3e1g:2eg:1 /f 2c3e1g:2eg:1 2c3e1g:2eg:1 -/F 2c3e1g:2ec-af:1 /a cege :21c-bAaGg :1 egc...",
  
  "+c..3-Aag.1f..D.dc...... /A  3c..1-Aag.f..D.dc...... f...g..2a..3b...+3C.. 1D.....",
  
  "3c1u,u 3c,1uf 3g1c1f:2cf:1 3u:41ufuf:11u, 2c.:41cc-w+c:1 c,c:2gf:1    3c1u,u 3g,1vA 3g1f1g:2vA:1 3g:41fgfg:11f, 2g.:41cc-w+c:1 c,c,  ",
  
  " 2cde. 3fe.4f g3a+c-a g2ceg 3abFD 2  -b+  1ga de g. b...",
  
  " 2ceg:2aA  /f  3c2e :1gaA  /g   4c2eg:2aA  /c  2+ce :1gaA  1+:4cegA:1+c",
  
  "   2c 3u,1D.,c.d..c ,c.2c.3u.1D...u.,c,.2.f.:2gb v.1A gbvgb:3bvgb:2vg:1..f..g...",
  "2c...3u.4f.3u.2d..1c,..  -2A...a.A.3a.2g...1A.a.g.,... 1g...2a...3w.+4c.d.u2fu...1d.c,..-w.+c.,c.........",
  " g...+c....-g...D.c..........,  :24c1dDc  4c1dD-c+ 4c1dDc  3c..-G...1gGg..5c...",	
  "-  6d+4dc-1g  6a4+du:2d1-u:1    6d+4dc-1g  6a4+du:2d1-u:1    6d+4dc-1g  6a4+du:2d1-u:1    6d+4dc-1g  6a4+du:2d1-u:1    ",
  "c......d....DDg..............F....+c-Aacf............e........4bg-b+DF.....gF. ..2g:2Ag:1..+1g.A.g..",
  
  "+1c.2D3dc-2b+1c. cf2G.G3b2G1g:2fgf:1f... f.a.b+:2cDc:1-ba.f...b2G1g.:2DdDd:1c...+c....",
  
  "1c2c3Dc 3f.2f1D  1c2c3Dc 3f.2f1D  1c2c3Dc 3f.2f1D  1c2c3Dc 3f.2f1D  ",
  "+2c4D5g.4G3g2.G1gfDcD 2c.1g.. /b- 2c4D5g.4a3g2.a1gfDc b/c+ 2c:2Df 3g2G1g...",
  
  ]
  
let somePercussions = [
   "5c..1F 5e..e..e..e.1F 5c..1F 5e..e..e..e.1F 5c..1F 5e..e..e..e.1F ",
   "5c7e6Ae  9c4:2GF:19A1A  5c7e.e  9c4:2GF:19A1A  5c7e.e  9c4:2GF:19A1A  ",
   "6c4eue 3cue:4uuuu:1   6c4eue 3cue:4uuuu:1   6c4eue 3cue:4uuuu:1   6c4eue 3cue:4uuuu:1   ",
   "9c1A9C2F1F7c1A1F  9c1A9C2F1F7c1A F 9c1A9C2FF7c1A F  ",
   " D.d eDb eb   Dbd eD. e.  D.d eDF eA DAd eD. e.  D.d eDb eb   Dbd eD. e:2CC:1  DCd eDA eF DAd eD. e. ",  
   "9c3C1d9C1b1b 9c.1d1duD     9c3C1d9C1b1b 9c.1d1duD     9c3C1d9C1b1b 9c.1d1duD     9c3C1d9C1b1b 9c.1d1duD     ",
   "5v1DDa  5A1DAv  5v1DDa  5A1DAb  5v1DDv  5A1DAb  5v1DDv  5A1DAb  4v,,:41vvvv:1 5v1DDa  5A1DAv  5v1DDa  5A1DAb  5v1DDv  5A1DAb  5v1DDv  5A1DAb  4v,,,",
   "5C1C9C1C5C1C1 :4FF D D3D1DDD:1 5C1C9C1C5C1C1 :4FF D D3D1DDD:1 5C1C9C1C5C1C1 :4FF D D3D1DDD:1 5C1C9C1C5C1C1 :4FF D D3D1DDD:1 ",
   "5F..C  .2e.:4dc.c:1 5F..C  .2e.:4dc.c:1 5vv.C .2e.:4vc.v:1  5F..C  .2e.:4dc.c:1 5F..C  .2e.:4dc.c:1 5vv.C .2e.:4vc.v:1",
   "1C1C9C1C5C1C1 DD 1C1C9C1C5C1C1 FF   1C1C9C1C5C1C1 DD 1C1C9C1C5C1C1 FF   1C1C9C1C5C1C1 DD 1C1C9C1C5C1C1 FF   ",
   "5c7e.e  9c4G3.1A  5c7e.e  9c4G3.1A  5c7e.e  9c4G3.1A  5c7e.e  9c4G3.1A  ",
]

let someScales = [
	"24 c 2 C 2 d 2 D 1 u 1 e 2 f 2 F 2 g 2 G 1 v 1 a 2 A 1 w 1 b 2",
	"  19 c 1 C 2 d 1 D 1 u 1 e 2 f 1 F 2  g 1 G 1 v 1 a 1 A 1 w 1 b 1",
]  