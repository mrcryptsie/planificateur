import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import gsap from "gsap";
import MainLayout from "@/components/layout/MainLayout";

// Import des composants réels
import Home from "@/pages/Home";
import ExamManagement from "@/pages/ExamManagement";
import AddExam from "@/pages/AddExam";
import RoomManagement from "@/pages/RoomManagement";
import ProctorManagement from "@/pages/ProctorManagement";
import Scheduler from "@/pages/Scheduler";
import ConflictResolution from "@/pages/ConflictResolution";
import ExportPlan from "@/pages/ExportPlan";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/exams" component={ExamManagement} />
        <Route path="/exams/add" component={AddExam} />
        <Route path="/rooms" component={RoomManagement} />
        <Route path="/proctors" component={ProctorManagement} />
        <Route path="/scheduler" component={Scheduler} />
        <Route path="/conflicts" component={ConflictResolution} />
        <Route path="/export" component={ExportPlan} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  useEffect(() => {
    // Create GSAP transition element
    const transitionDiv = document.createElement('div');
    transitionDiv.className = 'fixed top-0 left-0 w-full h-full bg-primary-500 z-[9999]';
    transitionDiv.style.transform = 'translateY(100%)';
    document.body.appendChild(transitionDiv);
    
    // Animate the page transition
    gsap.to(transitionDiv, {
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
      delay: 0.1,
      onComplete: () => {
        transitionDiv.remove();
      }
    });
    
    return () => {
      if (document.body.contains(transitionDiv)) {
        document.body.removeChild(transitionDiv);
      }
    };
  }, []);

  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
