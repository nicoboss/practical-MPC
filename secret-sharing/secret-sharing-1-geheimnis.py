import numpy as np
import matplotlib.pyplot as plt

teilnehmer = int(input("Teilnehmer: "))
a = list()
x = np.arange(1, teilnehmer+1)
y = np.zeros(teilnehmer)
a.append(float(input("Geheimnis: ")))
for i in range(teilnehmer-1):
    a.append(float(input(f"Koeffizient a{i+1}: ")))
for i in range(teilnehmer):
    for j in range(len(x)):
        y[i]+=a[j]*x[i]**j
for i in range(teilnehmer):
    print(f"Punkt für Teilnehmer {i+1}: x{i+1} = {x[i]}, y{i+1} = {y[i]}")


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


p = np.poly1d(np.polyfit(x, y, teilnehmer-1))
x_plot = np.linspace(-2, 6, 100)
_ = plt.plot(x, y, '.', x_plot, p(x_plot), '-')
plt.ylim(0, 20)
plt.show()
