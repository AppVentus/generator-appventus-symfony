<?php

namespace <%= app %>\Front\TemplateBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class GuiController extends Controller
{
    /**
     * @Route("/gui", name="front_template_gui")
     * @Template()
     */
    public function indexAction()
    {

        return array ();
    }
}
