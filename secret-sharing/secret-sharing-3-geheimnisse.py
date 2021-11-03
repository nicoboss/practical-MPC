import numpy as np
import matplotlib.pyplot as plt

class Person:
	def __init__(self, personenID, x):
		self.personenID = personenID
		self.a = list()
		self.x = x
		self.y = np.zeros(teilnehmer)
		self.a.append(float(input("Geheimnis: ")))
		for i in range(teilnehmer-1):
			self.a.append(float(input(f"Koeffizient a{i+1}: ")))
		for i in range(teilnehmer):
			for j in range(len(self.x)):
				self.y[i]+=self.a[j]*self.x[i]**j
		for i in range(teilnehmer):
			print(f"Punkt für Teilnehmer {i+1}: x{i+1} = {self.x[i]}, y{i+1} = {self.y[i]}")
	
	def brechneAddierterPunkt(self, y1, y2):
		self.addierterPunkt = self.y[self.personenID-1] + y1 + y2
		print(self.addierterPunkt)

teilnehmer = int(input("Teilnehmer: "))
x = np.arange(1, teilnehmer+1)
p1 = Person(x[0], x)
p2 = Person(x[1], x)
p3 = Person(x[2], x)
p1.brechneAddierterPunkt(p2.y[0], p3.y[0])
p2.brechneAddierterPunkt(p1.y[1], p3.y[1])
p3.brechneAddierterPunkt(p1.y[2], p2.y[2])
y = np.array([p1.addierterPunkt, p2.addierterPunkt, p3.addierterPunkt])

berechnetes_geheimnis = 0
for i in range(teilnehmer):
	lagrange = 1
	for j in range(teilnehmer):
		if i != j:
			print(f"((0 - {x[j]})/({x[i]} - {x[j]})) * ", end = '')
			lagrange *= (0 - x[j])/(x[i] - x[j])
	print(f"{y[i]} = {lagrange * y[i]}")
	berechnetes_geheimnis += lagrange * y[i]
print(f"Berechnetes Geheimnis: {berechnetes_geheimnis}")


p_poly = np.poly1d(np.polyfit(x, y, teilnehmer-1))
p1_poly = np.poly1d(np.polyfit(p1.x, p1.y, teilnehmer-1))
p2_poly = np.poly1d(np.polyfit(p2.x, p2.y, teilnehmer-1))
p3_poly = np.poly1d(np.polyfit(p3.x, p3.y, teilnehmer-1))
x_plot = np.linspace(-2, 6, 100)
fig = plt.figure()
ax = fig.add_subplot(1, 1, 1)
ax.spines['left'].set_position(('data', 0.0))
ax.spines['bottom'].set_position(('data', 0.0))
ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')
_ = plt.plot(x, y, '.', x_plot, p_poly(x_plot), '-')
_ = plt.plot(p1.x, p1.y, '.', x_plot, p1_poly(x_plot), '-')
_ = plt.plot(p2.x, p2.y, '.', x_plot, p2_poly(x_plot), '-')
_ = plt.plot(p3.x, p3.y, '.', x_plot, p3_poly(x_plot), '-')
plt.ylim(0, 40)
plt.show()
