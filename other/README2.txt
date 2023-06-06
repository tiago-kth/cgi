# cgi
 Work for the Computer Graphics and Interaction course at KTH

# Inspiration

https://www.youtube.com/watch?v=TOEi6T2mtHo

Splines
Path following
Raycasting
Autonomous Agents

Flow fields

Getting image data (Rasterization?) and making a particle systems redraw it.

Boids com campo de visão. Raycasting?


Shiffman: https://www.youtube.com/watch?v=rI_y2GAlQFM
Wave Function Collapse

Oskar Stalberg https://www.youtube.com/watch?v=0bcZb-SsnrA

javidx8
jdh
Sebastian lague


One Lone Coder

3D Engine
https://www.youtube.com/watch?v=ih20l3pJoeU

DDA Recasting
https://www.youtube.com/watch?v=NbSee-XM7WA

Raycasting
https://www.youtube.com/watch?v=Vij_obgv9h4

FPS Shooter
Upgraded https://www.youtube.com/watch?v=HEb2akswCcw

Original https://www.youtube.com/watch?v=xW8skO7MFYw


Command Prompt Console Game Engine
https://www.youtube.com/watch?v=cWc0hgYwZyc

shadertoy.com

https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

https://paveldogreat.github.io/WebGL-Fluid-Simulation/

Paper
Lily Pad: Towards Real-time Interactive Computational Fluid Dynamics
https://arxiv.org/abs/1510.06886

https://mikeash.com/pyblog/fluid-simulation-for-dummies.html

http://graphics.cs.cmu.edu/nsp/course/15-464/Fall09/papers/StamFluidforGames.pdf

https://www.researchgate.net/publication/2560062_Real-Time_Fluid_Dynamics_for_Games


Lab2

Duration 2,
Shape sphere
Radius .5
Emission: 0
Burst
Count 75
Start Lifetime 2
Speed 30
Start Size random 0.25, 1
Start Rotation 0 360
Renderer default line, default particle
*Limit Velocity over lifetime*
Speed 3, dampen 0.2
Size over lifetime
Collision: World
Color over lifetime
Gravity modifier
Trail

Transform
-0.027
0.705
0.112



5.448402
0.6847593
-1.411567




Target group. Have you nailed the basics to align with the target group and the use situation? Do you now have clear answers to questions like: where, how often and for how long they will play it? Have you done any game testing? If not, when, how and to find out what?


Business. Do you now have answers to how you will 1/ create an interest for the game and 2/ maintain an interest. Have you decided how you’ll enter the market? When and how will there be any revenue? To put it simple, who is your first customer? How and when do they pay for what?


\section{Implementation}

Our strategy for the implementation can be broken down as follows: 

\begin{itemize}
\item build a classic fluid dynamics simulation with the Navier-Stokes equations for incompressible flow, resulting in a fluid velocity grid
\item use this velocity grid as a vector field to move a particle system built on top of the fluid simulation, representing the algae or plankton
\item make the simulation interactive by allowing touching / clicking to generate new particles, and dragging to change the velocity field realistically
\item parametrize the particle system to simulate the bio-luminescence behavior
\end{itemize}

\subsection{The Navier-Stokes equations}

Fluids are everywhere around us -- and inside us. Beyond the engineering and scientific interest, the way they move can also be a source of delight, due to their aesthetically pleasing and random patterns.

Yet the mathematical modeling of fluids is a rather complicated matter. A testimony to this complexity is the fact that the most widely used model for the motion of fluids is the Navier-Stokes equations, and making "substantial progress toward a mathematical theory which will unlock [the equations'] secrets" is a challenge worth (literally) a million-dollar prize. (cite)

The beauty and power of the Navier-Stokes equations derive from the fact that they encapsulate two fundamental laws of Physics: the conservation of mass and the conservation of momentum (Newton's second law) (cite?)

For this simulation, we are using the Navier-Stokes equation in the following formulation, for a vector field \begin{math}
  \vec{u}((x,y),t)
\end{math} representing the velocity field, and a scalar field \begin{math}
  \rho((x,y),t)
\end{math} representing a scalar field of density moving through the velocity field:

\begin{equation}
  \frac{\partial\vec{u}}{\partial t} = -(\vec{u}\cdot\nabla)\vec{u} + \nu\nabla^2\vec{u} + \vec{f}
\end{equation}

\begin{equation}
  \frac{\partial\rho}{\partial t} = -(\vec{u}\cdot\nabla)\rho + \kappa\nabla^2\rho + S
\end{equation}

