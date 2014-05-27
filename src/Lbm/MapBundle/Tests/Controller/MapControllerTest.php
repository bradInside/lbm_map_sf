<?php

namespace Lbm\MapBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MapControllerTest extends WebTestCase
{
    public function testOpen()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/');
    }

}
