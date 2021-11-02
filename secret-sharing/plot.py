import numpy as np
import matplotlib.pyplot as plt

teilnehmer = int(input("Teilnehmer: "))
a = list()
x = np.arange(1, teilnehmer+1)
y = np.zeros(teilnehmer)
a.append(float(input("Geheimnis: ")))
for i in range(teilnehmer-1):
    a.append(float(input("Koeffizient a" + str(i+1) + ": ")))
for i in range(teilnehmer):
    for j in range(len(x)):
        y[i]+=a[j]*x[i]**j
for i in range(teilnehmer):
    print("Punkt für Teilnehmer " + str(i+1) + ": x" + str(i+1) + " = " + str(x[i]) + ", " "y" + str(i+1) + " = " + str(y[i]))
p = np.poly1d(np.polyfit(x, y, teilnehmer-1))
xp = np.linspace(-2, 6, 100)
_ = plt.plot(x, y, '.', xp, p(xp), '-')
plt.ylim(0, 20)
plt.show()