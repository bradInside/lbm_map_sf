<?php

namespace Lbm\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class MapController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function openAction()
    {
        return array('test'=>'test');
    }

}
