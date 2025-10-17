import Member from "../components/Member";

const AboutUsPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-fit min-h-screen justify-center items-center px-8 gap-8 pt-20">
      <h1 className="text-white text-6xl text-center font-semibold">
        Equipo <span className="text-green">QuantumPixel</span>
      </h1>
      <p className="text-white/75 text-center text-xl">Conoce a nuestro talentoso equipo de desarrolladores que hacen posible QuantumPixel.</p>
      <div className="our-team w-full h-fit flex flex-col md:flex-row justify-center items-center md:items-start gap-4">
        <Member
          name="Jean Pierre Cardenas"
          role="Desarrollador Frontend"
          image="./images/team/jean.jpg"
        />
        <Member
          name="Juan David Olaya"
          role="Desarrollador Backend"
          image="./images/team/juan-david.jpg"
        />
        <Member
          name="Juan Esteban Ortiz"
          role="Desarrollador de Base de Datos"
          image="./images/team/juan-esteban.jpg"
        />
        <Member
          name="Nicolas Enrique Granada"
          role="Tester"
          image="./images/team/nicolas.jpg"
        />
        <Member
          name="Oscar Mario Muñoz"
          role="Product Owner"
          image="./images/team/oscar.png"
        />
      </div>
    </div>
  );
};

export default AboutUsPage;
