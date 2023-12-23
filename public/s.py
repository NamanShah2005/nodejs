import numpy as np
import numpy.linalg as la

a = ([[1,-2,1],[0,2,-8],[5,0,-5]])
b = ([[0],[8],[10]])

c = np.matmul(la.inv(a),b)
print(c)

print(la.solve(a,b))