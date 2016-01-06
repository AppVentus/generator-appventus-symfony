<?php

namespace <%= app %>\Front\TemplateBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class GuiController extends Controller
{
    /**
     * @Route("/", name="front_template_gui")
     */
    public function indexAction()
    {
        return $this->render('<%= app %>FrontTemplateBundle/show.html.twig');
    }
}
